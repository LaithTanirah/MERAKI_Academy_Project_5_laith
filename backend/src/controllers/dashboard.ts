import { Request, Response } from "express";
import pool from "../models/connectDB";

// الكروت الرئيسية (KPIs)
export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const [products, orders, todayOrders, pendingOrders, customers] =
      await Promise.all([
        pool.query(`SELECT COUNT(*) FROM products`),
        pool.query(`SELECT COUNT(*) FROM cart WHERE is_deleted = TRUE`),
        pool.query(
          `SELECT COUNT(*) FROM cart WHERE DATE(created_at) = CURRENT_DATE AND is_deleted = TRUE`
        ),
        pool.query(
          `SELECT COUNT(*) FROM cart WHERE status = 'NEW' AND is_deleted = TRUE`
        ),
        pool.query(`SELECT COUNT(*) FROM users WHERE role_id = 3`),
      ]);

    res.json({
      totalProducts: Number(products.rows[0].count),
      totalOrders: Number(orders.rows[0].count),
      ordersToday: Number(todayOrders.rows[0].count),
      pendingOrders: Number(pendingOrders.rows[0].count),
      customers: Number(customers.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Pie Chart
export const getOrdersPerStatus = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM cart
      WHERE is_deleted = TRUE
      GROUP BY status
    `);

    res.json(
      rows.map((row) => ({
        name: row.status,
        value: Number(row.count),
      }))
    );
  } catch (error) {
    console.error("Orders per status error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Line Chart (Sales Over Week)
export const getSalesOverWeek = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Dy') AS day,
        COUNT(*) AS sales
      FROM cart
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        AND is_deleted = TRUE
      GROUP BY day, TO_CHAR(created_at, 'D')
      ORDER BY TO_CHAR(created_at, 'D')::int
    `);

    res.json(
      rows.map((row) => ({
        day: row.day.trim(),
        sales: Number(row.sales),
      }))
    );
  } catch (error) {
    console.error("Sales over week error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
