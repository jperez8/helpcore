import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Ticket, Message } from "@shared/schema";

export class GetTicketByIdUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private messageRepository: IMessageRepository
  ) {}

  async execute(id: string): Promise<{ ticket: Ticket; messages: Message[] } | null> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) return null;

    const messages = await this.messageRepository.findByTicketId(id);
    return { ticket, messages };
  }
}
