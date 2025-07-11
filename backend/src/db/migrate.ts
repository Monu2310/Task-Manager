import dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./index";

// Load environment variables
dotenv.config();

async function runMigrations() {
  console.log("Running migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
