import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IActivityLogRepository } from "../../domain/repositories/IActivityLogRepository";
import { InsertMessage, Message } from "@shared/schema";

export class AddMessageToTicketUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private messageRepository: IMessageRepository,
    private activityLogRepository: IActivityLogRepository
  ) {}

  async execute(messageData: InsertMessage): Promise<Message> {
    const ticket = await this.ticketRepository.findById(messageData.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const message = await this.messageRepository.create(messageData);

    if (messageData.authorType === "agent" && !ticket.firstReplyAt) {
      await this.ticketRepository.update(ticket.id, {
        firstReplyAt: new Date(),
      });
    }

    await this.activityLogRepository.create({
      ticketId: ticket.id,
      actor: messageData.authorName || "Usuario",
      actorId: messageData.authorId,
      action: "respondió al ticket",
      entity: `#${ticket.ticketNumber}`,
      metadata: { messageId: message.id },
    });

    return message;
  }
}
