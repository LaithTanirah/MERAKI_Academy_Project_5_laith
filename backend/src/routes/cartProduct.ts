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

cartProductRouter.post("/", addProductToCart);
cartProductRouter.get("/", getAllCartProducts);
cartProductRouter.get("/:cartId", getCartProductsByCartId);
cartProductRouter.put("/:cartId/:productId", updateCartProductQuantity);
cartProductRouter.delete("/:cartId/:productId", deleteCartProduct);
cartProductRouter.get("/cart/:cartId", getDetailedCartProductsByCartId);
cartProductRouter.get("/order/:userId", getOrderFromCartProductsByUserId);

export default cartProductRouter;
