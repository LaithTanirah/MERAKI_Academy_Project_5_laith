import { Request, Response } from "express";
import pool from "../models/connectDB";

//add product

export const addProductToOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { orderId, productID } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orderproduct (orderid,productid) VALUES ($1,$2) RETURNING *",
      [orderId, productID]
    );
    res
      .status(201)
      .json({ message: "Product added to order", data: result.rows[0] });
  } catch (error) {
    console.error("Error adding product to order:", error);
    res.status(500).json({ error: "Failed to add product to order" });
  }
};

// Show All products related to specfic order

export const getProductsByOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.* FROM products p
         JOIN orderproduct op ON p.id = op.productid
         WHERE op.orderid = $1`,
      [orderId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products by order:", error);
    res.status(500).json({ error: "Failed to get products for this order" });
  }
};
