import { Message, InsertMessage } from "@shared/schema";

export interface IMessageRepository {
  create(message: InsertMessage): Promise<Message>;
  findByTicketId(ticketId: string): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
}
