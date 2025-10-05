import { db } from "./db";
import { users } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  await db.insert(users).values([
    {
      email: "maria@ejemplo.com",
      name: "María García",
      role: "agent",
    },
    {
      email: "carlos@ejemplo.com",
      name: "Carlos López",
      role: "agent",
    },
    {
      email: "ana@ejemplo.com",
      name: "Ana Martínez",
      role: "admin",
    },
  ]);

  console.log("✓ Database seeded successfully!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
