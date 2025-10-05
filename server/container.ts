import { storage } from "./storage";
import { CreateTicketUseCase } from "./application/usecases/CreateTicket";
import { GetTicketsUseCase } from "./application/usecases/GetTickets";
import { GetTicketByIdUseCase } from "./application/usecases/GetTicketById";
import { AddMessageToTicketUseCase } from "./application/usecases/AddMessageToTicket";
import { UpdateTicketStatusUseCase } from "./application/usecases/UpdateTicketStatus";
import { ITicketRepository } from "./domain/repositories/ITicketRepository";
import { IMessageRepository } from "./domain/repositories/IMessageRepository";
import { IActivityLogRepository } from "./domain/repositories/IActivityLogRepository";
import { IUserRepository } from "./domain/repositories/IUserRepository";

const ticketRepo: ITicketRepository = {
  create: storage.tickets.create,
  findById: storage.tickets.findById,
  findAll: storage.tickets.findAll,
  update: storage.tickets.update,
  delete: async () => {},
  generateTicketNumber: storage.tickets.generateTicketNumber,
};

const messageRepo: IMessageRepository = {
  create: storage.messages.create,
  findByTicketId: storage.messages.findByTicketId,
  findById: async () => null,
};

const activityLogRepo: IActivityLogRepository = {
  create: storage.activityLogs.create,
  findAll: storage.activityLogs.findAll,
  findByTicketId: async () => [],
};

const userRepo: IUserRepository = {
  create: storage.users.create,
  findById: storage.users.findById,
  findByEmail: async () => null,
  findAll: storage.users.findAll,
};

export const container = {
  repositories: {
    ticket: ticketRepo,
    message: messageRepo,
    activityLog: activityLogRepo,
    user: userRepo,
  },
  useCases: {
    createTicket: new CreateTicketUseCase(ticketRepo, messageRepo, activityLogRepo),
    getTickets: new GetTicketsUseCase(ticketRepo),
    getTicketById: new GetTicketByIdUseCase(ticketRepo, messageRepo),
    addMessage: new AddMessageToTicketUseCase(ticketRepo, messageRepo, activityLogRepo),
    updateTicketStatus: new UpdateTicketStatusUseCase(ticketRepo, activityLogRepo),
  },
};
