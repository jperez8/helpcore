import { useQuery } from "@tanstack/react-query";
import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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
import type { ActivityLog } from "@shared/schema";

export default function ActivityLogPage() {
  const { data: activities = [], isLoading, isError, refetch } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity"],
  });

  const activityItems = activities.map(activity => ({
    actor: activity.actor,
    action: activity.action,
    entity: activity.entity,
    timestamp: new Date(activity.createdAt),
    icon: activity.action.includes("respondió") ? MessageSquare :
          activity.action.includes("asignado") ? UserPlus :
          activity.action.includes("cerró") || activity.action.includes("creó") ? CheckCircle :
          activity.action.includes("actualizó") || activity.action.includes("cambió") ? Edit :
          activity.action.includes("eliminó") ? Trash :
          AlertCircle,
  }));

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
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
          </>
        ) : isError ? (
          <Card className="glass p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar actividad</h3>
            <p className="text-sm text-muted-foreground mb-4">No se pudo cargar el registro de actividad</p>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </Card>
        ) : activityItems.length > 0 ? (
          activityItems.map((activity, i) => (
            <ActivityItem key={i} {...activity} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No hay actividad registrada</p>
        )}
      </motion.div>
    </div>
  );
}
