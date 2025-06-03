import { Request, Response } from "express";
import pool from "../models/connectDB";

const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
////////////////////////////////////////////////

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//////////////////////////////////////////////////////
interface products {
  product_id: number;
  product_title: string;
  product_description: string;
  product_price: number;
  product_size: string[];
}
const createProduct = async (req: Request, res: Response) => {
  try {
    const { product_title, product_description, product_price, product_size } =
      req.body;
    console.log("from create");
    const result = await pool.query(
      "INSERT INTO products (product_title, product_description, product_price, product_size) VALUES ($1, $2, $3, $4) RETURNING *",
      [product_title, product_description, product_price, product_size]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    console.log("from error");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/////////////////////////////////////////////

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { product_title, product_description, product_price, product_size } =
      req.body;

    const result = await pool.query(
      "UPDATE products SET product_title = $1, product_description = $2, product_price = $3, product_size = $4 WHERE product_id = $5 RETURNING *",
      [product_title, product_description, product_price, product_size, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////////////////

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM products WHERE product_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
};
