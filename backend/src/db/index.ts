import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://mayankmonu@localhost:5439/task_manager";

console.log("Using database URL:", connectionString);

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export type DB = typeof db;
