// src/models/user.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  generateResetPasswordToken: () => string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  this.resetPasswordToken = hash;
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return token;
};

export const User = mongoose.model<IUser>("User", UserSchema);
