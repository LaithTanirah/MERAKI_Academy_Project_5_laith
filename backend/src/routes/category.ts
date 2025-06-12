import express, { Router } from "express";
import {
  getAllcategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category";

const router = Router();

// GET /api/categories
router.get("/", getAllcategories);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

// POST /api/categories
router.post("/", createCategory);

// PUT /api/categories/:id
router.put("/:id", updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

export default router;
