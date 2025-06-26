import { Request, Response, NextFunction } from "express";
import pool from "../models/connectDB";

const checkSuspended = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.token?.userId;
    if (!userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    const result = await pool.query("SELECT is_suspended FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (result.rows[0].is_suspended) {
      return res.status(403).json({ success: false, message: "Account suspended" });
    }
    next();
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error", err: err.message });
  }
};

export default checkSuspended;
