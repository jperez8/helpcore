import type { Express, Request, Response } from "express";
import { z } from "zod";
import { insertTicketSchema, insertMessageSchema } from "@shared/schema";
import { container } from "./container";

const { useCases, repositories } = container;

export function registerRoutes(app: Express) {
  app.get("/api/tickets", async (req: Request, res: Response) => {
    try {
      const { status, priority, assigneeId, channel } = req.query;
      const tickets = await useCases.getTickets.execute({
        status: status as string,
        priority: priority as string,
        assigneeId: assigneeId as string,
        channel: channel as string,
      });
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req: Request, res: Response) => {
    try {
      const result = await useCases.getTicketById.execute(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const initialMessage = req.body.initialMessage as string | undefined;
      const ticket = await useCases.createTicket.execute(validatedData, initialMessage);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.post("/api/tickets/:id/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        ticketId: req.params.id,
      });
      const message = await useCases.addMessage.execute(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error adding message:", error);
      res.status(500).json({ error: "Failed to add message" });
    }
  });

  app.patch("/api/tickets/:id/status", async (req: Request, res: Response) => {
    try {
      const { status, actorName, actorId } = req.body;
      if (!status || !actorName) {
        return res.status(400).json({ error: "status and actorName are required" });
      }
      const ticket = await useCases.updateTicketStatus.execute(
        req.params.id,
        status,
        actorName,
        actorId
      );
      res.json(ticket);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      res.status(500).json({ error: "Failed to update ticket status" });
    }
  });

  app.get("/api/activity", async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      const activities = await repositories.activityLog.findAll({
        limit: limit ? parseInt(limit as string) : 50,
      });
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await repositories.user.findAll();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const webhookInboundSchema = z.object({
    subject: z.string(),
    customerName: z.string(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
    message: z.string(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    channel: z.string().default("whatsapp"),
  });

  app.post("/webhook/inbound", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const expectedKey = process.env.WEBHOOK_API_KEY || "dev_key_123";
      if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = webhookInboundSchema.parse(req.body);
      
      const ticket = await useCases.createTicket.execute(
        {
          subject: data.subject,
          customerName: data.customerName,
          customerEmail: data.customerEmail || null,
          customerPhone: data.customerPhone || null,
          priority: data.priority || "medium",
          channel: data.channel,
          status: "open",
          assigneeId: null,
          metadata: null,
        },
        data.message
      );

      res.status(201).json({
        success: true,
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error processing inbound webhook:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  app.post("/webhook/test/inbound", async (req: Request, res: Response) => {
    try {
      const ticket = await useCases.createTicket.execute(
        {
          subject: "Prueba desde webhook",
          customerName: "Cliente de Prueba",
          customerEmail: "prueba@ejemplo.com",
          customerPhone: "+34 600 000 000",
          priority: "medium",
          channel: "whatsapp",
          status: "open",
          assigneeId: null,
          metadata: null,
        },
        "Este es un mensaje de prueba del webhook"
      );

      res.status(201).json({
        success: true,
        message: "Test ticket created successfully",
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
      });
    } catch (error) {
      console.error("Error creating test ticket:", error);
      res.status(500).json({ error: "Failed to create test ticket" });
    }
  });
}
