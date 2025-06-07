// src/routes/user.routes.ts
import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/all", isAuthenticated, getUsers);

export default router;
