import express from "express";
import { createOrder, getOrdersByUser } from "../controllers/order";

const router = express.Router();

//POST/orders

router.post("/", createOrder);

//GET/orders/user/:userID
router.get("/user:userId", getOrdersByUser);

export default router;
