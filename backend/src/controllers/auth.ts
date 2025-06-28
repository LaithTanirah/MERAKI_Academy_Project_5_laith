import { Request, Response, NextFunction } from "express";
import pool from "../models/connectDB";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// -----------------------
// Google OAuth Login
// -----------------------
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", async (err: any, userData: any) => {
    if (err || !userData) {
      console.error("Google login failed:", err);
      return res.redirect(`${FRONTEND_URL}/login?error=GoogleLoginFailed`);
    }

    const { token } = userData;
    // Redirect back to frontend with token
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  })(req, res, next);
};

// -----------------------
// User Registration
// -----------------------
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, email, password, phone_number, role_id } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ error: "Please fill in all required fields." });
      return;
    }

    // Check if email already exists
    const { rows: existing } = await pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email]
    );
    if (existing.length) {
      res.status(400).json({ error: "Email is already in use." });
      return;
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Use provided role_id or fallback to default (2 = regular user)
    const assignedRoleId = role_id || 2;

    // Insert new user with role_id, is_suspended defaults to FALSE
    const { rows: userRows } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password, phone_number, role_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email, role_id, is_suspended
      `,
      [first_name, last_name, email, hashedPassword, phone_number || null, assignedRoleId]
    );
    const user = userRows[0];

    // Create active cart for new user
    await pool.query(
      `INSERT INTO cart (user_id, status) VALUES ($1, $2)`,
      [user.id, "ACTIVE"]
    );

    // Get cart ID
    const { rows: cartRows } = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND status = 'ACTIVE'`,
      [user.id]
    );
    const cartId = cartRows[0]?.id ?? null;

    res.status(201).json({ message: "Registered successfully.", user, cartId });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "An error occurred during registration." });
  }
};

// -----------------------
// User Login
// -----------------------
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check input
    if (!email || !password) {
      res.status(400).json({ error: "Please provide email and password." });
      return;
    }

    // Get user by email with role_id and suspension status
    const { rows: userRows } = await pool.query(
      `SELECT id, first_name, last_name, email, password, role_id, is_suspended
         FROM users WHERE email = $1`,
      [email]
    );
    if (!userRows.length) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    const user = userRows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    // If user is suspended, block access
    if (user.is_suspended) {
      return res.status(403).json({ error: "Account suspended. Please contact admin." });
    }

    // Generate token
    const token = JWT.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        is_suspended: user.is_suspended
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

// -----------------------
// Get All Users (for Admin)
// -----------------------
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, role_id, is_suspended
         FROM users
        WHERE is_deleted = FALSE`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// -----------------------
// Update User Role
// -----------------------
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  const { role_id } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users
          SET role_id = $1
        WHERE id = $2
        RETURNING id, first_name, last_name, email, role_id, is_suspended`,
      [role_id, userId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Error updating role" });
  }
};

// -----------------------
// Soft-delete User
// -----------------------
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      `UPDATE users
          SET is_deleted = TRUE
        WHERE id = $1
          AND is_deleted = FALSE
        RETURNING id, first_name, last_name, email`,
      [userId]
    );
    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "User not found or already deleted" });
    }
    res.json({ message: "User soft-deleted", user: rows[0] });
  } catch (err) {
    console.error("Error soft-deleting user:", err);
    res.status(500).json({ message: "Error soft-deleting user" });
  }
};

// -----------------------
// Suspend User (Admin action)
// -----------------------
export const suspendUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  try {
    const { rowCount } = await pool.query(
      `UPDATE users
         SET is_suspended = TRUE
       WHERE id = $1`,
      [userId]
    );
    if (!rowCount) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User suspended" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error suspending user" });
  }
};

// -----------------------
// Unsuspend User (Admin action)
// -----------------------
export const unsuspendUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  try {
    const { rowCount } = await pool.query(
      `UPDATE users
         SET is_suspended = FALSE
       WHERE id = $1`,
      [userId]
    );
    if (!rowCount) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User reinstated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reinstating user" });
  }
};

// -----------------------
// Get Current User Profile
// -----------------------
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  // Assuming JWT payload is decoded in a middleware and attached to req.user
  const userId = (req as any).token.userId;
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, role_id, is_suspended
         FROM users
        WHERE id = $1`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
