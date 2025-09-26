import { Pool } from "postgres";
import { load } from "dotenv";

const env = await load();

const databaseUrl = Deno.env.get("DATABASE_URL") || env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool(databaseUrl, 3, true);

export { pool };