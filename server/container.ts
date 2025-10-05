import { CreateTicketUseCase } from "./application/usecases/CreateTicket";
import { GetTicketsUseCase } from "./application/usecases/GetTickets";
import { GetTicketByIdUseCase } from "./application/usecases/GetTicketById";
import { AddMessageToTicketUseCase } from "./application/usecases/AddMessageToTicket";
import { UpdateTicketStatusUseCase } from "./application/usecases/UpdateTicketStatus";
import { UpdateTicketPriorityUseCase } from "./application/usecases/UpdateTicketPriority";
import { TicketRepository } from "./infrastructure/repositories/TicketRepository";
import { MessageRepository } from "./infrastructure/repositories/MessageRepository";
import { ActivityLogRepository } from "./infrastructure/repositories/ActivityLogRepository";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { CreateUserUseCase } from "./application/usecases/CreateUser";
import { UpdateUserUseCase } from "./application/usecases/UpdateUser";

const ticketRepo = new TicketRepository();
const messageRepo = new MessageRepository();
const activityLogRepo = new ActivityLogRepository();
const userRepo = new UserRepository();

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
    updateTicketPriority: new UpdateTicketPriorityUseCase(ticketRepo, activityLogRepo),
    createUser: new CreateUserUseCase(userRepo),
    updateUser: new UpdateUserUseCase(userRepo),
  },
};
