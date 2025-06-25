import { Router } from "express";
const {
  addProductToCart,
  getAllCartProducts,
  getCartProductsByCartId,
  updateCartProductQuantity,
  deleteCartProduct,
  getDetailedCartProductsByCartId,
  getOrderFromCartProductsByUserId,
} = require("../controllers/cartProduct");

const cartProductRouter = Router();

// ------------------------------
// Orders - User
// ------------------------------
// Fetch detailed orders for a given user
cartProductRouter.get("/order/:userId", getOrderFromCartProductsByUserId);

// ------------------------------
// Cart Details
// ------------------------------

cartProductRouter.get("/cart/:cartId", getDetailedCartProductsByCartId);

// ------------------------------
// Cart Products (Basic CRUD)
// ------------------------------
// Add a product to cart
cartProductRouter.post("/", addProductToCart);
// Retrieve all cart-product relationships
cartProductRouter.get("/", getAllCartProducts);
// Update quantity of a specific product in a cart
cartProductRouter.put("/:cartId/:productId", updateCartProductQuantity);
// Remove a product from a cart
cartProductRouter.delete("/:cartId/:productId", deleteCartProduct);
// Retrieve all products for a specific cart (basic listing)
cartProductRouter.get("/:cartId", getCartProductsByCartId);

export default cartProductRouter;
