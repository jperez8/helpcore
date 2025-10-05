import { eq, desc } from "drizzle-orm";
import { db } from "../../db";
import { messages, InsertMessage, Message } from "@shared/schema";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";

export class MessageRepository implements IMessageRepository {
  async create(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async findByTicketId(ticketId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.ticketId, ticketId))
      .orderBy(messages.createdAt);
  }

  async findById(id: string): Promise<Message | null> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || null;
  }
}
