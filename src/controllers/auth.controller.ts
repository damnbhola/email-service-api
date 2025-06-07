// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendResetEmail } from "../utils/email";

const isProduction = process.env.NODE_ENV === "production";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // set to true in production with HTTPS
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    res.status(201).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // set to true in production with HTTPS
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const accessToken = generateAccessToken(payload.userId);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const sendPasswordResetLink = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendResetEmail(email, resetUrl);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "Token and password are required" });
    return;
  }

  // Hash the token to match DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }, // token is still valid
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired reset token" });
    return;
  }

  // Update password and clear reset fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ success: true });
};
