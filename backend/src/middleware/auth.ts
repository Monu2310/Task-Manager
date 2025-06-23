import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  const token = authorization.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here") as JWTPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
