import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  googleCallback,
  getAllUsers,
  updateUserRole,
  deleteUser,
  suspendUser,
  unsuspendUser,
  getProfile
} from "../controllers/auth";
import authenticateJWT  from "../middleware/authentication";

const router = Router();

// -----------------------
// Authentication
// -----------------------
router.post("/register", register);
router.post("/login", login);

// -----------------------
// Google OAuth
// -----------------------
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// -----------------------
// User Profile
// -----------------------
// Get current user's profile including suspension status
router.get("/profile", authenticateJWT, getProfile);

// -----------------------
// User Management (Admin)
// -----------------------
// Get all users with suspension status
router.get("/users", authenticateJWT, getAllUsers);
// Update user role
router.put("/users/:id/role", authenticateJWT, updateUserRole);
// Suspend a user account
router.put("/users/:id/suspend", authenticateJWT, suspendUser);
// Unsuspend a user account
router.put("/users/:id/unsuspend", authenticateJWT, unsuspendUser);
// Soft-delete a user
router.delete("/users/:id", authenticateJWT, deleteUser);

export default router;
