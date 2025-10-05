import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import https from "https";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: "no-store",
    agent: httpsAgent,
  },
});

export const db = drizzle(sql, { schema });
