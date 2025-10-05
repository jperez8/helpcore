import { ActivityLog, InsertActivityLog } from "@shared/schema";

export interface IActivityLogRepository {
  create(log: InsertActivityLog): Promise<ActivityLog>;
  findAll(filters?: ActivityLogFilters): Promise<ActivityLog[]>;
  findByTicketId(ticketId: string): Promise<ActivityLog[]>;
}

export interface ActivityLogFilters {
  ticketId?: string;
  actorId?: string;
  action?: string;
  limit?: number;
}
