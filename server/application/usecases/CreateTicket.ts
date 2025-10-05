import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IActivityLogRepository } from "../../domain/repositories/IActivityLogRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { InsertTicket, Ticket, InsertMessage } from "@shared/schema";

export class CreateTicketUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private messageRepository: IMessageRepository,
    private activityLogRepository: IActivityLogRepository
  ) {}

  async execute(ticketData: InsertTicket, initialMessage?: string): Promise<Ticket> {
    const ticketNumber = await this.ticketRepository.generateTicketNumber();
    
    const ticket = await this.ticketRepository.create({
      ...ticketData,
      ticketNumber,
    } as InsertTicket);

    if (initialMessage) {
      const message: InsertMessage = {
        ticketId: ticket.id,
        text: initialMessage,
        authorType: "customer",
        authorName: ticketData.customerName,
        authorId: null,
        attachments: null,
      };
      await this.messageRepository.create(message);
    }

    await this.activityLogRepository.create({
      ticketId: ticket.id,
      actor: "Sistema",
      actorId: null,
      action: "creó el ticket",
      entity: `#${ticketNumber}`,
      metadata: { channel: ticketData.channel },
    });

    return ticket;
  }
}
