// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecretaccess";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "supersecretrefresh";

const ACCESS_TOKEN_EXPIRE =
  (process.env.ACCESS_TOKEN_EXPIRE as SignOptions["expiresIn"]) || "15m";
const REFRESH_TOKEN_EXPIRE =
  (process.env.REFRESH_TOKEN_EXPIRE as SignOptions["expiresIn"]) || "1d";

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as { userId: string };

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as { userId: string };
