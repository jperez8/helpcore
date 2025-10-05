import { Ticket, InsertTicket } from "@shared/schema";

export interface ITicketRepository {
  create(ticket: InsertTicket & { ticketNumber: string }): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findAll(filters?: TicketFilters): Promise<Ticket[]>;
  update(id: string, ticket: Partial<InsertTicket>): Promise<Ticket>;
  delete(id: string): Promise<void>;
  generateTicketNumber(): Promise<string>;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  channel?: string;
}
