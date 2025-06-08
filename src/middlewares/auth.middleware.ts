// src/middlewares/auth.middlewares.ts
import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AuthRequest } from "../types/request";

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
