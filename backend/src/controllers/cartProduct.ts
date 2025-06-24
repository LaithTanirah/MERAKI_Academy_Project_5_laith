import { Request, Response } from "express";
import pool from "../models/connectDB";

const addProductToCart = (req: Request, res: Response): void => {
  const { cartId, productId } = req.body;

  const query = `
    INSERT INTO cartProduct (cartId, productId)
    VALUES ($1, $2)
    RETURNING *
  `;

  pool
    .query(query, [cartId, productId])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        result: result.rows[0],
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const getAllCartProducts = (_: Request, res: Response): void => {
  const query = `SELECT * FROM cartProduct`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All cart products retrieved successfully",
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const getCartProductsByCartId = (req: Request, res: Response): void => {
  const { cartId } = req.params;

  const query = `SELECT * FROM cartProduct WHERE cartId = $1`;

  pool
    .query(query, [cartId])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Cart products for cart_id: ${cartId}`,
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const updateCartProductQuantity = (req: Request, res: Response): void => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  const query = `
    UPDATE cartProduct SET quantity = $1
    WHERE cartId = $2 AND productId = $3
    RETURNING *
  `;

  pool
    .query(query, [quantity, cartId, productId])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Quantity updated successfully",
        result: result.rows[0],
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const deleteCartProduct = (req: Request, res: Response): void => {
  const { cartId, productId } = req.params;

  const query = `DELETE FROM cartProduct WHERE cartId = $1 AND productId = $2`;

  pool
    .query(query, [cartId, productId])
    .then(() => {
      res.status(200).json({
        success: true,
        message: `Product ${productId} removed from cart ${cartId}`,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};
const getDetailedCartProductsByCartId = (req: Request, res: Response): void => {
  const { cartId } = req.params;

  const query = `
    SELECT 
      cp.cartid,
      p.id AS productId,
      p.title AS product_title,
      p.price,
      p.images,
      p.size,
      cp.quantity
    FROM 
      cart c 
    JOIN 
      cartProduct cp ON c.id = cp.cartid 
    JOIN 
      products p ON cp.productid = p.id 
    WHERE 
      cp.cartid = $1
  `;

  pool
    .query(query, [cartId])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Detailed products for cart ${cartId} retrieved successfully`,
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const getOrderFromCartProductsByUserId = (
  req: Request,
  res: Response
): void => {
  const { userId } = req.params;

  const query = `
   SELECT 
  c.id AS cart_id,
  c.user_id,
  c.status,
  json_agg(
    json_build_object(
      'productId', p.id,
      'product_title', p.title,
      'price', p.price,
      'images', p.images,
      'size', p.size,
      'quantity', cp.quantity
    )
  ) AS products
FROM 
  cart c 
JOIN 
  cartProduct cp ON c.id = cp.cartid 
JOIN 
  products p ON cp.productid = p.id 
WHERE 
  c.user_id = $1 AND c.is_deleted = $2
GROUP BY 
  c.id, c.user_id;

  `;

  pool
    .query(query, [userId, "true"])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Detailed orders for user id ${userId} retrieved successfully`,
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

module.exports = {
  addProductToCart,
  getAllCartProducts,
  getCartProductsByCartId,
  updateCartProductQuantity,
  deleteCartProduct,
  getDetailedCartProductsByCartId,
  getOrderFromCartProductsByUserId,
};
