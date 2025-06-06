// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};
