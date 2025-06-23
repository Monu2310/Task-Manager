import cors from "cors";

export function corsMiddleware() {
  return cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.netlify.app", // Replace with your actual Netlify URL
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
}
