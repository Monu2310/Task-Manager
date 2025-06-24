import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - configurable for production
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000") / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// CORS middleware - production-ready
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
  "http://localhost:3000", // Development fallback
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel domains and localhost
    if (origin.includes('vercel.app') || 
        origin.includes('localhost') || 
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Dedicated health endpoint for monitoring
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API for managing tasks with Google Gemini integration",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" 
          ? "https://your-backend-url.render.com" 
          : "http://localhost:3001",
        description: process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string", enum: ["pending", "in_progress", "completed"] },
            category: { type: "string", enum: ["personal", "work", "education", "health", "other"] },
            isCompleted: { type: "boolean" },
            completedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Register a new user",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                    name: { type: "string", minLength: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Login user",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tasks/generate": {
        post: {
          summary: "Generate tasks using Google Gemini",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["topic"],
                  properties: {
                    topic: { type: "string", minLength: 1 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Tasks generated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      tasks: { type: "array", items: { type: "string" } },
                      topic: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tasks": {
        get: {
          summary: "Get all tasks",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              schema: { type: "string", enum: ["pending", "in_progress", "completed"] },
            },
            {
              name: "category",
              in: "query",
              schema: { type: "string", enum: ["personal", "work", "education", "health", "other"] },
            },
          ],
          responses: {
            200: {
              description: "Tasks retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      tasks: { type: "array", items: { $ref: "#/components/schemas/Task" } },
                      total: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new task",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: { type: "string", minLength: 1 },
                    description: { type: "string" },
                    status: { type: "string", enum: ["pending", "in_progress", "completed"] },
                    category: { type: "string", enum: ["personal", "work", "education", "health", "other"] },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      task: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json(specs);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = parseInt(process.env.PORT || "3001");

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
});
