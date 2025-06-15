import { Request, Response } from "express";
import pool from "../models/connectDB";

// Add a favorite
const addFavorite = (req: Request, res: Response): void => {
  const { productId, userId } = req.body;

  const query = `
    INSERT INTO favorite (productId, userId)
    VALUES ($1, $2)
    RETURNING *
  `;

  pool
    .query(query, [productId, userId])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Favorite added successfully",
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


// Get favorites by user ID
const getFavoritesByUserId = (req: Request, res: Response): void => {
  const { userId } = req.params;

  const query = `SELECT * FROM favorite WHERE userId = $1`;

  pool
    .query(query, [userId])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `Favorites for userId: ${userId}`,
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

// Delete a favorite by favorite ID
const deleteFavorite = (req: Request, res: Response): void => {
  const { id } = req.params;

  const query = `DELETE FROM favorite WHERE id = $1`;

  pool
    .query(query, [id])
    .then(() => {
      res.status(200).json({
        success: true,
        message: `Favorite with id ${id} deleted successfully`,
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
  addFavorite,
  getFavoritesByUserId,
  deleteFavorite,
};
