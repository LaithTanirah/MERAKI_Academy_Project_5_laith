import { Request, Response } from "express";
import pool from "../models/connectDB";
import { Product } from "../types/product";

// GET /api/products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query<Product>(
      `SELECT * 
         FROM products 
        WHERE isdeleted = false`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/products/:id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  try {
    const result = await pool.query<Product>(
      `SELECT * 
         FROM products 
        WHERE id = $1 
          AND isdeleted = false`,
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/products
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, price, size, images, categoryid } = req.body;
  try {
    const result = await pool.query<Product>(
      `INSERT INTO products
         (title, description, price, size, images, categoryid )
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, description, price, size, images, categoryid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/products/:id
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  const { title, description, price, size, images, categoryid } = req.body;
  try {
    const result = await pool.query<Product>(
      `UPDATE products
          SET title=$1, description=$2, price=$3, size=$4, images=$5, categoryid=$6
        WHERE id=$7 AND isdeleted=false
        RETURNING *`,
      [title, description, price, size, images, categoryid, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Product not found or deleted" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  try {
    const result = await pool.query(
      `UPDATE products
          SET isdeleted=true
        WHERE id=$1 AND isdeleted=false`,
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Product not found or already deleted" });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
