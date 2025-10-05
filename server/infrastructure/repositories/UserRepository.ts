import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, InsertUser, User } from "@shared/schema";
import { IUserRepository, UserCreateInput } from "../../domain/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async create(user: UserCreateInput): Promise<User> {
    const [created] = await db.insert(users).values(user as InsertUser & { id?: string }).returning();
    return created;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  async update(id: string, user: Partial<InsertUser>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
}
