import { Ticket, Message, ActivityLog, User, InsertTicket, InsertMessage, InsertActivityLog, InsertUser } from "@shared/schema";

export interface IStorage {
  tickets: {
    create(ticket: InsertTicket & { ticketNumber: string }): Promise<Ticket>;
    findById(id: string): Promise<Ticket | null>;
    findAll(filters?: Record<string, any>): Promise<Ticket[]>;
    update(id: string, ticket: Partial<InsertTicket>): Promise<Ticket>;
    generateTicketNumber(): Promise<string>;
  };
  messages: {
    create(message: InsertMessage): Promise<Message>;
    findByTicketId(ticketId: string): Promise<Message[]>;
  };
  activityLogs: {
    create(log: InsertActivityLog): Promise<ActivityLog>;
    findAll(filters?: Record<string, any>): Promise<ActivityLog[]>;
  };
  users: {
    create(user: InsertUser): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
  };
}

class MemStorage implements IStorage {
  private ticketsData: Ticket[] = [];
  private messagesData: Message[] = [];
  private activityLogsData: ActivityLog[] = [];
  private usersData: User[] = [
    {
      id: crypto.randomUUID(),
      email: "maria@ejemplo.com",
      name: "María García",
      role: "agent",
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      email: "carlos@ejemplo.com",
      name: "Carlos López",
      role: "agent",
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      email: "ana@ejemplo.com",
      name: "Ana Martínez",
      role: "admin",
      createdAt: new Date(),
    },
  ];

  tickets = {
    create: async (ticket: InsertTicket & { ticketNumber: string }): Promise<Ticket> => {
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        ...ticket,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
        firstReplyAt: null,
      };
      this.ticketsData.push(newTicket);
      return newTicket;
    },
    findById: async (id: string): Promise<Ticket | null> => {
      return this.ticketsData.find(t => t.id === id) || null;
    },
    findAll: async (filters?: Record<string, any>): Promise<Ticket[]> => {
      let results = [...this.ticketsData];
      if (filters) {
        if (filters.status) results = results.filter(t => t.status === filters.status);
        if (filters.priority) results = results.filter(t => t.priority === filters.priority);
        if (filters.assigneeId) results = results.filter(t => t.assigneeId === filters.assigneeId);
        if (filters.channel) results = results.filter(t => t.channel === filters.channel);
      }
      return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    update: async (id: string, ticketData: Partial<InsertTicket>): Promise<Ticket> => {
      const index = this.ticketsData.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Ticket not found");
      this.ticketsData[index] = {
        ...this.ticketsData[index],
        ...ticketData,
        updatedAt: new Date(),
      };
      return this.ticketsData[index];
    },
    generateTicketNumber: async (): Promise<string> => {
      const count = this.ticketsData.length;
      return `TK-${(count + 1).toString().padStart(3, "0")}`;
    },
  };

  messages = {
    create: async (message: InsertMessage): Promise<Message> => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        ...message,
        createdAt: new Date(),
      };
      this.messagesData.push(newMessage);
      return newMessage;
    },
    findByTicketId: async (ticketId: string): Promise<Message[]> => {
      return this.messagesData
        .filter(m => m.ticketId === ticketId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },
  };

  activityLogs = {
    create: async (log: InsertActivityLog): Promise<ActivityLog> => {
      const newLog: ActivityLog = {
        id: crypto.randomUUID(),
        ...log,
        createdAt: new Date(),
      };
      this.activityLogsData.push(newLog);
      return newLog;
    },
    findAll: async (filters?: Record<string, any>): Promise<ActivityLog[]> => {
      let results = [...this.activityLogsData];
      if (filters?.limit) results = results.slice(0, filters.limit);
      return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
  };

  users = {
    create: async (user: InsertUser): Promise<User> => {
      const newUser: User = {
        id: crypto.randomUUID(),
        ...user,
        createdAt: new Date(),
      };
      this.usersData.push(newUser);
      return newUser;
    },
    findAll: async (): Promise<User[]> => {
      return this.usersData;
    },
    findById: async (id: string): Promise<User | null> => {
      return this.usersData.find(u => u.id === id) || null;
    },
  };
}

export const storage: IStorage = new MemStorage();
