// src/routes/auth.routes.ts
import { Router } from "express";
import { signup, login, refreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh-token", refreshToken);

export default router;
