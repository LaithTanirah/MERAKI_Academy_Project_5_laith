// backend/src/controllers/deliveryReviewsController.ts

import { Request, Response } from "express";
import pool from "../models/connectDB";

/**
 * Handle submitting a delivery review
 */
export async function submitDeliveryReview(req: Request, res: Response): Promise<void> {
  const { order_id, rating, comment } = req.body as {
    order_id: number;
    rating: number;
    comment?: string;
  };

  try {
    // check the order in cart
    const { rows } = await pool.query(
      "SELECT status, delivery_person_id FROM cart WHERE id = $1",
      [order_id]
    );

    if (!rows.length) {
      res.status(404).json({ error: "Order (cart) not found" });
      return;
    }

    if (rows[0].status !== "Delivered") {
      res.status(400).json({ error: "Cannot review before delivery" });
      return;
    }

    await pool.query(
      `INSERT INTO delivery_reviews (order_id, delivery_person_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [order_id, rows[0].delivery_person_id ?? null, rating, comment ?? null]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("submitDeliveryReview error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * Get an existing delivery review for an order
 */
export async function getDeliveryReview(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id, order_id, rating, comment
       FROM delivery_reviews
       WHERE order_id = $1`,
      [orderId]
    );

    if (!rows.length) {
      res.status(404).json({ message: "No review yet" });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getDeliveryReview error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
