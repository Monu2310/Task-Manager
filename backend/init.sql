
-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE task_manager'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'task_manager');

-- Switch to the task_manager database
\c task_manager;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created by Drizzle migrations
-- This file just ensures the database and extensions are ready
