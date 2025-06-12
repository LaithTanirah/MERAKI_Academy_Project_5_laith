// controllers/auth.ts
import { Request, Response } from "express";
import pool from "../models/connectDB";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // bring field  from body
    const { first_name, last_name, email, password, phone_number } = req.body;

    //Check that required fields exist
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ error: "please fill all required fields" });
      return;
    }

    //Check email already exist ? if its not !
    const { rows: existing } = await pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email]
    );
    if (existing.length) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    // create bcrypt.js
    const salt = bcrypt.genSaltSync(10);
    // split the hash
    const hashed = bcrypt.hashSync(password, salt);

    // inser newUser
    const { rows: userRows } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password, phone_number)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, first_name, last_name, email
      `,
      [first_name, last_name, email, hashed, phone_number || null]
    );
    const user = userRows[0];

    // create jwt token after register
    const token = Jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // RETURN SUCCESS DATA WITH OUT PASSWORD
    // also create an active cart for this user
    await pool.query(
      `
      INSERT INTO carts (user_id, status, is_deleted, created_at, updated_at)
      VALUES ($1, 'ACTIVE', false, NOW(), NOW())
      `,
      [user.id]
    );

    // fetch the new cartId
    const { rows: cartRows } = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1`,
      [user.id]
    );
    const cartId = cartRows[0]?.id ?? null;

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      cartId,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Error during register, please try later." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // bring Email password
    const { email, password } = req.body;

    //Check email password
    if (!email || !password) {
      res.status(400).json({ error: "please fill email and password" });
      return;
    }

    // search
    const { rows: userRows } = await pool.query(
      `SELECT id, first_name, last_name, email, password FROM users WHERE email = $1`,
      [email]
    );
    if (!userRows.length) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }
    const user = userRows[0];

    // compare password
    if (!bcrypt.compareSync(password, user.password)) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    //after check Pass
    let cartId: number;
    const { rows: existingCart } = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1`,
      [user.id]
    );
    if (existingCart.length) {
      cartId = existingCart[0].id;
    } else {
      const { rows: newCart } = await pool.query(
        `
        INSERT INTO carts (user_id, status, is_deleted, created_at, updated_at)
        VALUES ($1, 'ACTIVE', false, NOW(), NOW())
        RETURNING id
        `,
        [user.id]
      );
      cartId = newCart[0].id;
    }

    // return without password
    const token = Jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      cartId,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Error during login, please try later." });
  }
};
