import { Router } from "express";
const {
  addProductToCart,
  getAllCartProducts,
  getCartProductsByCartId,
  updateCartProductQuantity,
  deleteCartProduct,
} = require("../controllers/cartProduct");

const cartProductRouter = Router();

cartProductRouter.post("/", addProductToCart);
cartProductRouter.get("/", getAllCartProducts);
cartProductRouter.get("/:cartId", getCartProductsByCartId);
cartProductRouter.put("/:cartId/:productId", updateCartProductQuantity);
cartProductRouter.delete("/:cartId/:productId", deleteCartProduct);

export default cartProductRouter;
