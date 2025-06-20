import { Request, Response } from "express";
import pool from "../models/connectDB";

// get All categories
export const getAllcategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM category WHERE is_deleted = false
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get categories error :", error);
    res.status(500).json({ error: "Failed to fetch categories " });
  }
};

// ✅ get category by id - FIXED
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;

  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM category WHERE id = $1 AND is_deleted = false
      `,
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get category error :", error);
    res.status(500).json({ error: "Failed to fetch category " });
  }
};

// create new Category
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, image } = req.body;
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO category (title,image) VALUES ($1, $2) RETURNING *
      `,
      [title, image]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// edit category
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  const { title, image } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE category SET title = $1, image = $2 WHERE id = $3 AND is_deleted = false RETURNING *",
      [title, image, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Category not found or deleted" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// soft delete
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  try {
    const result = await pool.query(
      "UPDATE category SET is_deleted = true WHERE id = $1 AND is_deleted = false",
      [id]
    );
    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ message: "Category not found or already deleted" });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
