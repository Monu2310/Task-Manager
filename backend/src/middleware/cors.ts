import cors from "cors";

export function corsMiddleware() {
  return cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001", 
      "http://localhost:3002",
      "https://task-manager-kappa-ebon.vercel.app",
      "https://*.vercel.app", // Allow all Vercel deployments
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
}
