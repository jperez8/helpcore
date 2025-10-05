import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { tickets, InsertTicket, Ticket } from "@shared/schema";
import { ITicketRepository, TicketFilters } from "../../domain/repositories/ITicketRepository";

export class TicketRepository implements ITicketRepository {
  async create(ticket: InsertTicket & { ticketNumber: string }): Promise<Ticket> {
    const [created] = await db.insert(tickets).values(ticket).returning();
    return created;
  }

  async findById(id: string): Promise<Ticket | null> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || null;
  }

  async findAll(filters?: TicketFilters): Promise<Ticket[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(tickets.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(tickets.priority, filters.priority));
    }
    if (filters?.assigneeId) {
      conditions.push(eq(tickets.assigneeId, filters.assigneeId));
    }
    if (filters?.channel) {
      conditions.push(eq(tickets.channel, filters.channel));
    }

    let query = db.select().from(tickets);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query.orderBy(desc(tickets.createdAt));
  }

  async update(id: string, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    const [updated] = await db
      .update(tickets)
      .set({ ...ticketData, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.delete(tickets).where(eq(tickets.id, id));
  }

  async generateTicketNumber(): Promise<string> {
    const latestTickets = await db
      .select({ ticketNumber: tickets.ticketNumber })
      .from(tickets)
      .orderBy(desc(tickets.createdAt))
      .limit(1);

    if (latestTickets.length === 0) {
      return "TK-001";
    }

    const lastNumber = parseInt(latestTickets[0].ticketNumber.split("-")[1]);
    const nextNumber = lastNumber + 1;
    return `TK-${nextNumber.toString().padStart(3, "0")}`;
  }
}
