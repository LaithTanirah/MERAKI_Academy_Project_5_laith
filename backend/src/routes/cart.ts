import { Router } from "express";

const {
  getAllCartByIsDeletedTrue,
  createNewCart,
  getAllCartByIsDeletedFalse,
  deleteCartById,
} = require("../controllers/cart");

const cartRouter = Router();

cartRouter.get("/getAllCartByIsDeletedTrue", getAllCartByIsDeletedTrue);
cartRouter.get("/getAllCartByIsDeletedFalse", getAllCartByIsDeletedFalse);
cartRouter.post("/createNewCart", createNewCart);
cartRouter.put("/deleteCartById/:id", deleteCartById);

export default cartRouter;
