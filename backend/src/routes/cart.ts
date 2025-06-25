import { Router } from "express";
import authentication from "../middleware/authentication";

const {
  getAllCartByIsDeletedTrue,
  createNewCart,
  getAllCartByIsDeletedFalse,
  deleteCartById,
  checkoutCart,
  getUnclaimedOrders,
  claimOrder,
  getMyOrders,
  deliverOrder,
} = require("../controllers/cart");

const cartRouter = Router();

// Fetch completed orders for a user
cartRouter.get(
  "/getAllCartByIsDeletedTrue/:userId",
  authentication,
  getAllCartByIsDeletedTrue
);

// Fetch active (open) carts for a user
cartRouter.get(
  "/getAllCartByIsDeletedFalse/:userId",
  authentication,
  getAllCartByIsDeletedFalse
);

// Create a new shopping cart
cartRouter.post("/createNewCart", authentication, createNewCart);

// Soft-delete a cart (mark as deleted)
cartRouter.put("/deleteCartById/:id", authentication, deleteCartById);

// Checkout: mark cart as a new order
cartRouter.put("/checkout/:cartId", authentication, checkoutCart);

// Get all unclaimed orders (for delivery persons)
cartRouter.get("/unclaimed", authentication, getUnclaimedOrders);

// Claim an order for processing
cartRouter.put("/claim/:cartId", authentication, claimOrder);

// Get orders assigned to a specific delivery person
cartRouter.get("/delivery/:deliveryPersonId", authentication, getMyOrders);

// Mark an order as Delivered
cartRouter.put("/deliver/:cartId", authentication, deliverOrder);

export default cartRouter;
