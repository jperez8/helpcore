import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: "no-store",
  },
  fullResults: true,
});

export const db = drizzle(sql, { schema });
