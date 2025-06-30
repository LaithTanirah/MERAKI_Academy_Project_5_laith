import { Request, Response, NextFunction } from "express";
import pool from "../models/connectDB";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
import crypto from "crypto";
import nodemailer from "nodemailer";
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
    const { first_name, last_name, email, password, phone_number, role_id } =
      req.body;

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
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone_number || null,
        assignedRoleId,
      ]
    );
    const user = userRows[0];

    // Create active cart for new user
    await pool.query(`INSERT INTO cart (user_id, status) VALUES ($1, $2)`, [
      user.id,
      "ACTIVE",
    ]);

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
      return res
        .status(403)
        .json({ error: "Account suspended. Please contact admin." });
    }

    // Generate token
    const token = JWT.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        is_suspended: user.is_suspended,
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
// src/controllers/auth.ts
// -----------------------
// Get All Users (for Admin)
// -----------------------
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // include phone_number in query
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, role_id, is_suspended, phone_number
       FROM users
       WHERE is_deleted = FALSE`
    );

    // map results with phone
    const result = rows.map((user) => ({
      id: user.id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
      is_suspended: user.is_suspended,
      phone_number: user.phone_number,
      avatar:
        user.role_id === 1
          ? "/avatars/admin.png"
          : user.role_id === 4
          ? "/avatars/delivery.png"
          : "/avatars/customer.png",
      role:
        user.role_id === 1
          ? "Admin"
          : user.role_id === 4
          ? "Delivery"
          : "Customer",
    }));

    // send to frontend
    res.json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// -----------------------
// Update User Role
// -----------------------
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const suspendUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const unsuspendUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Assuming JWT payload is decoded in a middleware and attached to req.user
  const userId = (req as any).token.userId;
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, phone_number, role_id, is_suspended
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
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, role_id, is_suspended
         FROM users
        WHERE id = $1 AND is_deleted = FALSE`,
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    let role: "Customer" | "Delivery" | "Admin" = "Customer";
    if (user.role_id === 4) role = "Delivery";
    if (user.role_id === 1) role = "Admin";

    let avatar = "/avatars/customer.png";
    if (role === "Delivery") avatar = "/avatars/delivery.png";
    if (role === "Admin") avatar = "/avatars/admin.png";

    res.json({
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      role,
      avatar,
      online: true,
    });
  } catch (err) {
    console.error("Error fetching user by id:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // userId from JWT
    const userId = (req as any).token.userId;
    const { first_name, last_name, email, phone_number } = req.body;

    // check data
    if (!first_name || !last_name || !email) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    // user deateals
    const { rows: userRows } = await pool.query(
      `SELECT id, role_id FROM users WHERE id = $1 AND is_deleted = FALSE`,
      [userId]
    );

    if (!userRows.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = userRows[0];
    const roleId = user.role_id;

    // roles
    // 1 = admin
    // 3 = user
    // 4 = delivery
    if (![1, 3, 4].includes(roleId)) {
      res
        .status(403)
        .json({ error: "You do not have permission to update profile." });
      return;
    }

    //check email
    const { rows: existing } = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      [email, userId]
    );

    if (existing.length) {
      res.status(400).json({ error: "Email is already used by another user." });
      return;
    }

    // Updated
    const { rows: updated } = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, email = $3, phone_number = $4
       WHERE id = $5
       RETURNING id, first_name, last_name, email, phone_number, role_id`,
      [first_name, last_name, email, phone_number, userId]
    );

    res.json({
      message: "Profile updated successfully.",
      user: updated[0],
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile." });
  }
};
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).token.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const { rows } = await pool.query(
      `SELECT password FROM users WHERE id = $1`,
      [userId]
    );

    if (!rows.length) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const currentHashed = rows[0].password;

    const isMatch = await bcrypt.compare(oldPassword, currentHashed);
    if (!isMatch) {
      res.status(400).json({ error: "Old password is incorrect." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedNew = bcrypt.hashSync(newPassword, salt);

    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hashedNew,
      userId,
    ]);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { rows } = await pool.query(`SELECT id FROM users WHERE email = $1`, [
      email,
    ]);
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = rows[0].id;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3`, 
      [resetToken, resetTokenExpiry, userId]
    );

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Avocado Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send reset link." });
  }
};

// -----------------------
// Reset Password (إعادة تعيين كلمة المرور)
// -----------------------
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ error: "Token and new password are required." });

  try {
    const { rows } = await pool.query(
      `SELECT id, reset_token_expiry FROM users WHERE reset_token = $1`,
      [token]
    );
    if (!rows.length) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    const user = rows[0];

    if (Date.now() > user.reset_token_expiry) {
      return res.status(400).json({ error: "Reset token has expired." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await pool.query(
      `UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password." });
  }
};
