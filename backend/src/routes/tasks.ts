import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/index";
import { tasks, insertTaskSchema, updateTaskSchema } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validation";
import { generateTasks } from "../utils/gemini";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Generate tasks schema
const generateTasksSchema = z.object({
  topic: z.string().min(1),
});

// Update task status schema
const updateStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]),
  isCompleted: z.boolean().optional(),
});

// Query filter schema
const queryFilterSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  category: z.enum(["personal", "work", "education", "health", "other"]).optional(),
});

// Generate tasks with Gemini API
router.post("/generate", validateBody(generateTasksSchema), async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    
    const generatedTasks = await generateTasks(topic);
    
    return res.json({
      message: "Tasks generated successfully",
      tasks: generatedTasks,
      topic,
    });
  } catch (error) {
    console.error("Generate tasks error:", error);
    return res.status(500).json({ error: "Failed to generate tasks" });
  }
});

// Create a new task
router.post("/", validateBody(insertTaskSchema), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const taskData = req.body;

    const [newTask] = await db.insert(tasks).values({
      ...taskData,
      userId: user.userId,
    }).returning();

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ error: "Failed to create task" });
  }
});

// Get all tasks for the authenticated user
router.get("/", validateQuery(queryFilterSchema), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { status, category } = req.query as { status?: string; category?: string };

    // Build where conditions
    let whereConditions = [eq(tasks.userId, user.userId)];
    
    if (status) {
      whereConditions.push(eq(tasks.status, status as any));
    }
    if (category) {
      whereConditions.push(eq(tasks.category, category as any));
    }

    const userTasks = await db.select()
      .from(tasks)
      .where(and(...whereConditions))
      .orderBy(desc(tasks.createdAt));

    return res.json({
      tasks: userTasks,
      total: userTasks.length,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get task statistics
router.get("/stats/overview", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, user.userId));
    
    const stats = {
      total: userTasks.length,
      completed: userTasks.filter((task: any) => task.isCompleted).length,
      pending: userTasks.filter((task: any) => task.status === "pending").length,
      inProgress: userTasks.filter((task: any) => task.status === "in_progress").length,
      byCategory: {
        personal: userTasks.filter((task: any) => task.category === "personal").length,
        work: userTasks.filter((task: any) => task.category === "work").length,
        education: userTasks.filter((task: any) => task.category === "education").length,
        health: userTasks.filter((task: any) => task.category === "health").length,
        other: userTasks.filter((task: any) => task.category === "other").length,
      },
      completionRate: userTasks.length > 0 ? (userTasks.filter((task: any) => task.isCompleted).length / userTasks.length) * 100 : 0,
    };

    return res.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Get a specific task
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const taskId = req.params.id;

    const [task] = await db.select().from(tasks).where(
      and(eq(tasks.id, taskId), eq(tasks.userId, user.userId))
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    return res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Update a task
router.put("/:id", validateBody(updateTaskSchema), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const taskId = req.params.id;
    const updateData = req.body;

    // Add completion timestamp if task is being marked as completed
    if (updateData.status === "completed" || updateData.isCompleted === true) {
      updateData.completedAt = new Date();
      updateData.isCompleted = true;
    } else if (updateData.status !== "completed") {
      updateData.completedAt = null;
      updateData.isCompleted = false;
    }

    const [updatedTask] = await db.update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .returning();

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ error: "Failed to update task" });
  }
});

// Update task status (quick endpoint for status changes)
router.patch("/:id/status", validateBody(updateStatusSchema), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const taskId = req.params.id;
    const { status, isCompleted } = req.body;

    const updateData: any = { status, updatedAt: new Date() };
    
    if (status === "completed" || isCompleted === true) {
      updateData.completedAt = new Date();
      updateData.isCompleted = true;
    } else {
      updateData.completedAt = null;
      updateData.isCompleted = false;
    }

    const [updatedTask] = await db.update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .returning();

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    return res.status(500).json({ error: "Failed to update task status" });
  }
});

// Delete a task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const taskId = req.params.id;

    const [deletedTask] = await db.delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.userId)))
      .returning();

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
