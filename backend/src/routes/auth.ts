import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/index";
import { users } from "../db/schema";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { eq } from "drizzle-orm";
import { validateBody } from "../middleware/validation";

const router = Router();

// Register schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register endpoint
router.post("/register", validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    });

    // Generate token
    const token = generateToken({ userId: newUser.id, email: newUser.email });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
