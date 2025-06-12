import express from "express";
import {
  addProductToOrder,
  getProductsByOrder,
} from "../controllers/orderProduct";

const router = express.Router();

router.post("/", addProductToOrder);
router.get("/:orderId", getProductsByOrder);

export default router;
