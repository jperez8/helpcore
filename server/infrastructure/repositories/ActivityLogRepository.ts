import { eq, desc } from "drizzle-orm";
import { db } from "../../db";
import { activityLogs, InsertActivityLog, ActivityLog } from "@shared/schema";
import { IActivityLogRepository, ActivityLogFilters } from "../../domain/repositories/IActivityLogRepository";

export class ActivityLogRepository implements IActivityLogRepository {
  async create(log: InsertActivityLog): Promise<ActivityLog> {
    const [created] = await db.insert(activityLogs).values(log).returning();
    return created;
  }

  async findAll(filters?: ActivityLogFilters): Promise<ActivityLog[]> {
    let query = db.select().from(activityLogs);

    if (filters?.ticketId) {
      query = query.where(eq(activityLogs.ticketId, filters.ticketId)) as any;
    }

    query = query.orderBy(desc(activityLogs.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    return query;
  }

  async findByTicketId(ticketId: string): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.ticketId, ticketId))
      .orderBy(desc(activityLogs.createdAt));
  }
}
