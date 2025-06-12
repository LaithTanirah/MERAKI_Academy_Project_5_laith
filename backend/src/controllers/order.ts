import { Request, Response } from "express";
import pool from "../models/connectDB";
import { promises } from "dns";

//create new Order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.body;
  const userId = req.body.userId;

  try {
    const result = await pool.query(
      `INSERT INTO orders (status,userid) VALUES ($1,$2) RETURNING*`,
      [status, userId]
    );
    res.status(201).json({ message: "Order created", order: result.rows[0] });
  } catch (error) {
    console.error("Create order error", error);
    res.status(500).json({ error: "Something went wrong creating order" });
  }
};

//Bring all requested order ByID

export const getOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE userid = $1", [
      userId,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get orders error", error);
    res.status(500).json({ error: "Something went wrong fetching orders" });
  }
};
