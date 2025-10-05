import ActivityItem from "@/components/ActivityItem";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, UserPlus, CheckCircle, AlertCircle, Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityLogPage() {
  //todo: remove mock functionality
  const activities = [
    { actor: "María García", action: "respondió al ticket", entity: "#TK-001", timestamp: new Date(Date.now() - 1000 * 60 * 5), icon: MessageSquare },
    { actor: "Carlos López", action: "fue asignado al ticket", entity: "#TK-002", timestamp: new Date(Date.now() - 1000 * 60 * 15), icon: UserPlus },
    { actor: "Ana Martínez", action: "cerró el ticket", entity: "#TK-003", timestamp: new Date(Date.now() - 1000 * 60 * 30), icon: CheckCircle },
    { actor: "Sistema", action: "cambió la prioridad del ticket", entity: "#TK-004", timestamp: new Date(Date.now() - 1000 * 60 * 60), icon: AlertCircle },
    { actor: "María García", action: "actualizó el estado del ticket", entity: "#TK-005", timestamp: new Date(Date.now() - 1000 * 60 * 90), icon: Edit },
    { actor: "Carlos López", action: "eliminó el comentario del ticket", entity: "#TK-006", timestamp: new Date(Date.now() - 1000 * 60 * 120), icon: Trash },
    { actor: "Sistema", action: "creó un nuevo ticket desde webhook", entity: "#TK-007", timestamp: new Date(Date.now() - 1000 * 60 * 180), icon: MessageSquare },
    { actor: "Ana Martínez", action: "respondió al ticket", entity: "#TK-008", timestamp: new Date(Date.now() - 1000 * 60 * 240), icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">Actividad Reciente</h2>
        <p className="text-muted-foreground">Registro de todas las acciones del sistema</p>
      </motion.div>

      <div className="glass p-4 rounded-lg">
        <div className="flex gap-3 flex-wrap">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] glass-sm" data-testid="select-event-type">
              <SelectValue placeholder="Tipo de evento" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">Todos los eventos</SelectItem>
              <SelectItem value="created">Creados</SelectItem>
              <SelectItem value="replied">Respondidos</SelectItem>
              <SelectItem value="assigned">Asignados</SelectItem>
              <SelectItem value="status_changed">Cambio de estado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[200px] glass-sm" data-testid="select-date-range">
              <SelectValue placeholder="Rango de fecha" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="all">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="glass-sm" data-testid="button-export">
            Exportar
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        {activities.map((activity, i) => (
          <ActivityItem key={i} {...activity} />
        ))}
      </motion.div>
    </div>
  );
}
