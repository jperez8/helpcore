import { useState } from "react";
import TicketCard from "@/components/TicketCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface TicketListPageProps {
  onTicketClick?: (id: string) => void;
  onCreateTicket?: () => void;
}

export default function TicketListPage({ onTicketClick, onCreateTicket }: TicketListPageProps) {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const tickets = [
    {
      id: "TK-001",
      subject: "¿Cuánto tarda cambiar la pantalla del iPhone 12?",
      customer: "Juan Pérez",
      status: "open" as const,
      priority: "high" as const,
      channel: "whatsapp" as const,
      assignee: "María García",
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "TK-002",
      subject: "Consulta sobre garantía de reparación",
      customer: "Ana Martínez",
      status: "pending_customer" as const,
      priority: "medium" as const,
      channel: "email" as const,
      assignee: "Carlos López",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "TK-003",
      subject: "Presupuesto para cambio de batería",
      customer: "Luis Rodríguez",
      status: "pending_agent" as const,
      priority: "low" as const,
      channel: "web" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: "TK-004",
      subject: "Problema con carga inalámbrica",
      customer: "Carmen Silva",
      status: "closed" as const,
      priority: "medium" as const,
      channel: "whatsapp" as const,
      assignee: "María García",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tickets</h2>
          <p className="text-muted-foreground">Gestiona todas las solicitudes de soporte</p>
        </div>
        <Button onClick={onCreateTicket} data-testid="button-create-ticket">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      <div className="glass p-4 rounded-lg space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-sm border-white/10"
              data-testid="input-search-tickets"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] glass-sm" data-testid="select-status">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] glass-sm" data-testid="select-priority">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="glass-sm" data-testid="button-filters">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              {...ticket}
              onClick={() => onTicketClick?.(ticket.id)}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
