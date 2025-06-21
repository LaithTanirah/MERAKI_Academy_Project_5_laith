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
  "/getAllCartByIsDeletedTrue/:userId",
  authentication,
  getAllCartByIsDeletedTrue
);
cartRouter.get(
  "/getAllCartByIsDeletedFalse/:userId",
  authentication,
  getAllCartByIsDeletedFalse
);
cartRouter.post("/createNewCart", authentication, createNewCart);
cartRouter.put("/deleteCartById/:id", authentication, deleteCartById);

export default cartRouter;
