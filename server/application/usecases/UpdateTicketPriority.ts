import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IActivityLogRepository } from "../../domain/repositories/IActivityLogRepository";
import { Ticket } from "@shared/schema";

export class UpdateTicketPriorityUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private activityLogRepository: IActivityLogRepository
  ) {}

  async execute(
    ticketId: string,
    newPriority: string,
    actorName: string,
    actorId?: string | null
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      priority: newPriority,
    });

    try {
      await this.activityLogRepository.create({
        ticketId: ticket.id,
        actor: actorName,
        actorId: actorId || null,
        action: "cambió la prioridad del ticket",
        entity: `#${ticket.ticketNumber}`,
        metadata: { oldPriority: ticket.priority, newPriority },
      });
    } catch (error) {
      console.error("Failed to persist priority change activity log", error);
    }

    return updatedTicket;
  }
}
