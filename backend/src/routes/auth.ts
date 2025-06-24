import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  googleCallback,
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../controllers/auth";

const router = Router();

// --- Authentication ---
router.post("/register", register);
router.post("/login", login);

// --- Google OAuth ---
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// --- User Management ---
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
