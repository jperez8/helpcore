import { ITicketRepository, TicketFilters } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "@shared/schema";

export class GetTicketsUseCase {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(filters?: TicketFilters): Promise<Ticket[]> {
    return this.ticketRepository.findAll(filters);
  }
}
