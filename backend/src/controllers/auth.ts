// controllers/auth.ts
import { Request, Response } from "express";
import pool from "../models/connectDB";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract fields from request body
    const { first_name, last_name, email, password, phone_number } = req.body;

    // Check for required fields
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ error: "Please fill in all required fields." });
      return;
    }

    // Check if the email already exists
    const { rows: existing } = await pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email]
    );
    if (existing.length) {
      res.status(400).json({ error: "Email is already in use." });
      return;
    }

    // Hash the password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the new user into the 'users' table
    const { rows: userRows } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email
      `,
      [first_name, last_name, email, hashedPassword, phone_number || null]
    );

    const user = userRows[0];

    // Create a cart for the new user
    await pool.query(`INSERT INTO cart (user_id, status) VALUES ($1, $2)`, [
      user.id,
      "ACTIVE",
    ]);

    // Retrieve the new cart ID
    const { rows: cartRows } = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND status = 'ACTIVE'`,
      [user.id]
    );

    const cartId = cartRows[0]?.id ?? null;

    // Respond with success message and user data (excluding password)
    res.status(201).json({
      message: "Registered successfully.",
      user,
      cartId,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      error: "An error occurred during registration. Please try again later.",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Please provide email and password." });
      return;
    }

    // Find user by email
    const { rows: userRows } = await pool.query(
      `SELECT id, first_name, last_name, email, password FROM users WHERE email = $1`,
      [email]
    );

    if (!userRows.length) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    const user = userRows[0];

    // Compare passwords
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    // Generate JWT token
    const token = JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response (without password)
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({
        error: "An error occurred during login. Please try again later.",
      });
  }
};
