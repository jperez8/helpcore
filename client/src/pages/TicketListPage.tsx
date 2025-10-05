import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TicketCard from "@/components/TicketCard";
import SkeletonCard from "@/components/SkeletonCard";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Ticket } from "@shared/schema";

interface TicketListPageProps {
  onTicketClick?: (id: string) => void;
}

export default function TicketListPage({ onTicketClick }: TicketListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: tickets = [], isLoading, isError, error, refetch } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
    retry: 2,
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tickets</h2>
          <p className="text-muted-foreground">Gestiona todas las solicitudes de soporte</p>
        </div>
        <CreateTicketDialog />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] glass-sm" data-testid="select-status">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="pending_agent">Pendiente agente</SelectItem>
              <SelectItem value="pending_customer">Pendiente cliente</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
        ) : isError ? (
          <Card className="glass p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar tickets</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "No se pudieron cargar los tickets"}
            </p>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </Card>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              id={ticket.ticketNumber}
              subject={ticket.subject}
              customer={ticket.customerName}
              status={ticket.status as any}
              priority={ticket.priority as any}
              channel={ticket.channel as any}
              assignee={ticket.assigneeId || undefined}
              createdAt={new Date(ticket.createdAt)}
              onClick={() => onTicketClick?.(ticket.id)}
            />
          ))
        ) : (
          <Card className="glass p-8 text-center">
            <p className="text-muted-foreground">No se encontraron tickets</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
