import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  googleCallback,
} from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
