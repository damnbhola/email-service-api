// src/routes/auth.routes.ts
import { Router } from "express";
import {
  signup,
  login,
  refreshToken,
  sendPasswordResetLink,
  validatePassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.post("/send-password-reset-link", sendPasswordResetLink);
router.post("/validate-password/:token", validatePassword);
router.post("/reset-password/:token", resetPassword);

export default router;
