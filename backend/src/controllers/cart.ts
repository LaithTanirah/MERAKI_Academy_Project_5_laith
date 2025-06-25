import { Request, Response } from "express";
import pool from "../models/connectDB";

// Interface for token payload (if using authentication middleware)
interface TokenPayload {
  userId: number;
}

// Extend Express Request to include token payload
interface AuthenticatedRequest extends Request {
  token: TokenPayload;
}

// Create a new shopping cart for a user
const createNewCart = (req: AuthenticatedRequest, res: Response): void => {
  const { user_id } = req.body;
  const query = `INSERT INTO cart (user_id, status) VALUES ($1, $2) RETURNING *`;
  pool
    .query(query, [user_id, "ACTIVE"])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Cart created successfully",
        result: result.rows[0],
      });
    })
    .catch((err: Error) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

// Retrieve all carts marked as deleted (completed orders) for a user
const getAllCartByIsDeletedTrue = (req: Request, res: Response): void => {
  const { userId } = req.params;
  const query = `SELECT * FROM cart WHERE user_id = $1`;
  pool
    .query(query, [userId])
    .then((result) => {
      const carts = result.rows.filter((c) => c.is_deleted === true);
      res.status(200).json({ success: true, cart: carts });
    })
    .catch((err: Error) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

// Retrieve all active (non-deleted) carts for a user
const getAllCartByIsDeletedFalse = (req: Request, res: Response): void => {
  const { userId } = req.params;
  const query = `SELECT * FROM cart WHERE user_id = $1`;
  pool
    .query(query, [userId])
    .then((result) => {
      const carts = result.rows.filter((c) => c.is_deleted === false);
      res.status(200).json({ success: true, cart: carts });
    })
    .catch((err: Error) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

// Soft-delete a cart by marking is_deleted = true
const deleteCartById = (req: Request, res: Response): void => {
  const query = `UPDATE cart SET is_deleted = TRUE WHERE id = $1`;
  pool
    .query(query, [req.params.id])
    .then(() => {
      res.status(200).json({ success: true, message: `Cart ${req.params.id} deleted` });
    })
    .catch((err: Error) => {
      res.status(500).json({ success: false, error: err.message });
    });
};

// Checkout a cart
const checkoutCart = async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE cart
         SET is_deleted = TRUE,
             status     = 'NEW'
       WHERE id = $1
       RETURNING id AS cart_id, user_id, status;`,
      [cartId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, result: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all unclaimed orders: carts with is_deleted = true and no delivery_person assigned
const getUnclaimedOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         c.id      AS cart_id,
         c.user_id,
         c.status
       FROM cart c
       WHERE c.delivery_person_id IS NULL
         AND c.is_deleted = TRUE;`
    );
    res.status(200).json({ success: true, result: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Claim an order: assign a delivery person to the first unclaimed cart
const claimOrder = async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;
  const { delivery_person_id } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE cart
         SET delivery_person_id = $1,
             status = 'Processing'
       WHERE id = $2
         AND delivery_person_id IS NULL
       RETURNING id AS cart_id, user_id, status;`,
      [delivery_person_id, cartId]
    );
    if (!rows.length) {
      return res.status(409).json({ success: false, message: "Order already claimed" });
    }
    res.status(200).json({ success: true, result: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get orders claimed by a specific delivery person
const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  const { deliveryPersonId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT 
         c.id      AS cart_id,
         c.user_id,
         c.status
       FROM cart c
       WHERE c.delivery_person_id = $1
         AND c.is_deleted = TRUE;`,
      [deliveryPersonId]
    );
    res.status(200).json({ success: true, result: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mark an order as Delivered
const deliverOrder = async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE cart
         SET status = 'Delivered'
       WHERE id = $1
         AND delivery_person_id IS NOT NULL
       RETURNING id AS cart_id, user_id, status;`,
      [cartId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Order not found or not claimed" });
    }
    res.status(200).json({ success: true, result: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  createNewCart,
  getAllCartByIsDeletedTrue,
  getAllCartByIsDeletedFalse,
  deleteCartById,
  checkoutCart,
  getUnclaimedOrders,
  claimOrder,
  getMyOrders,
  deliverOrder
};
