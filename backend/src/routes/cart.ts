import { Router } from "express";
import authentication from "../middleware/authentication";

const {
  getAllCartByIsDeletedTrue,
  createNewCart,
  getAllCartByIsDeletedFalse,
  deleteCartById,
} = require("../controllers/cart");

const cartRouter = Router();

cartRouter.get(
  "/getAllCartByIsDeletedTrue",
  authentication,
  getAllCartByIsDeletedTrue
);
cartRouter.get(
  "/getAllCartByIsDeletedFalse",
  authentication,
  getAllCartByIsDeletedFalse
);
cartRouter.post("/createNewCart", authentication, createNewCart);
cartRouter.put("/deleteCartById/:id", authentication, deleteCartById);

export default cartRouter;
