import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: { userId: string; email: string }): string {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_key_here";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
