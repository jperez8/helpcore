import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IActivityLogRepository } from "../../domain/repositories/IActivityLogRepository";
import { Ticket } from "@shared/schema";

export class UpdateTicketStatusUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private activityLogRepository: IActivityLogRepository
  ) {}

  async execute(
    ticketId: string,
    newStatus: string,
    actorName: string,
    actorId?: string | null
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      status: newStatus,
      ...(newStatus === "closed" && { closedAt: new Date() }),
    });

    await this.activityLogRepository.create({
      ticketId: ticket.id,
      actor: actorName,
      actorId: actorId || null,
      action: "cambió el estado del ticket",
      entity: `#${ticket.ticketNumber}`,
      metadata: { oldStatus: ticket.status, newStatus },
    });

    return updatedTicket;
  }
}
