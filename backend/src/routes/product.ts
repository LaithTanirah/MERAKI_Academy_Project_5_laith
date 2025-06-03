import express, { Router } from "express";
const {
  getProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
} = require("../controllers/product");

const productRoutes: Router = express.Router();

productRoutes.get("/", getProducts);
productRoutes.get("/products/:id", getProductById);
productRoutes.post("/", createProduct);
productRoutes.put("/products/:id", updateProduct);
productRoutes.delete("/products/:id", deleteProduct);

export default productRoutes;
