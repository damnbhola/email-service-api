// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../types/request";

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne(
      { _id: req.userId },
      { name: 1, email: 1 }
    ).lean();
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, { name: 1, email: 1 }).lean();
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};
