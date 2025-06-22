import { Request, Response } from "express";
import pool from "../models/connectDB";

// Interface for token (add this based on your actual middleware)
interface TokenPayload {
  userId: number;
}
interface AuthenticatedRequest extends Request {
  token: TokenPayload;
}

const createNewCart = (req: AuthenticatedRequest, res: Response): void => {
  const { user_id } = req.body;
  const query = `INSERT INTO cart (user_id, status) VALUES ($1, $2)`;
  pool
    .query(query, [user_id, "ACTIVE"])
    .then((result) => {
      console.log(result);

      res.status(201).json({
        success: true,
        message: "Cart created successfully",
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function returns all cart by isDeleted = true
const getAllCartByIsDeletedTrue = (req: Request, res: Response): void => {
  const { userId } = req.params;
  const query = "SELECT * FROM cart WHERE userId = $1";
  pool
    .query(query, [userId])
    .then((result) => {
      const carts = result.rows.filter((ele) => ele.is_deleted === true);
      res.status(200).json({
        success: true,
        message: `All the carts by is is_deleted = true where user_Id = ${userId}`,
        cart: carts,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const getAllCartByIsDeletedFalse = (req: Request, res: Response): void => {
  const { userId } = req.params;
  const query = "SELECT * FROM cart WHERE user_Id = $1";
  pool
    .query(query, [userId])
    .then((result) => {
      const carts = result.rows.filter((ele) => ele.is_deleted === false);
      res.status(200).json({
        success: true,
        message: `All the carts by is_deleted = false where userId = ${userId}`,
        cart: carts,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

// This function soft deletes a specific article by ID
export const deleteCartById = (req: Request, res: Response): void => {
  const query = "UPDATE cart SET is_deleted = $1 WHERE id = $2";
  pool
    .query(query, [true, req.params.id])
    .then(() => {
      res.status(200).json({
        success: true,
        message: `cart with id: ${req.params.id} deleted successfully`,
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

module.exports = {
  createNewCart,
  getAllCartByIsDeletedTrue,
  getAllCartByIsDeletedFalse,
  deleteCartById,
};
