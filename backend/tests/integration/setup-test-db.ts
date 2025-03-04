import dotenv from "dotenv";
import {drizzle} from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

dotenv.config({path: ".env.test"});

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:secret@localhost:5433/drizzle_test";

export const db = drizzle(DATABASE_URL);

export async function startTransaction() {
    await db.execute("BEGIN");
}

export async function rollbackTransaction() {
    await db.execute("ROLLBACK");
}

export async function applyMigrations() {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
}

export async function setup() {
    await applyMigrations();
}
