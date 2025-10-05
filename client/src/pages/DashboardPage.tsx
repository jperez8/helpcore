import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/MetricCard";
import ActivityItem from "@/components/ActivityItem";
import SkeletonCard from "@/components/SkeletonCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, CheckCircle, TrendingUp, MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Ticket as TicketType, ActivityLog } from "@shared/schema";

export default function DashboardPage() {
  const { data: tickets = [], isLoading: ticketsLoading, isError: ticketsError, refetch: refetchTickets } = useQuery<TicketType[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: activities = [], isLoading: activitiesLoading, isError: activitiesError, refetch: refetchActivities } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity"],
  });

  const openTickets = tickets.filter(t => t.status === "open").length;
  const closedToday = tickets.filter(t => {
    if (!t.closedAt) return false;
    const today = new Date();
    const closedDate = new Date(t.closedAt);
    return closedDate.toDateString() === today.toDateString();
  }).length;

  const metrics = [
    { title: "Tickets Abiertos", value: openTickets, icon: Ticket },
    { title: "Total Tickets", value: tickets.length, icon: Clock },
    { title: "Resueltos Hoy", value: closedToday, icon: CheckCircle },
    { title: "Pendientes", value: tickets.filter(t => t.status === "pending_agent" || t.status === "pending_customer").length, icon: TrendingUp },
  ];

  const activityItems = activities.slice(0, 4).map(activity => ({
    actor: activity.actor,
    action: activity.action,
    entity: activity.entity,
    timestamp: new Date(activity.createdAt),
    icon: activity.action.includes("respondió") ? MessageSquare :
          activity.action.includes("asignado") ? UserPlus :
          activity.action.includes("cerró") || activity.action.includes("creó") ? CheckCircle :
          AlertCircle,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">Panel de Control</h2>
        <p className="text-muted-foreground">Vista general de tu sistema de soporte</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ticketsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : ticketsError ? (
          <Card className="glass p-6 col-span-full text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-sm text-muted-foreground mb-4">Error al cargar métricas</p>
            <Button onClick={() => refetchTickets()}>Reintentar</Button>
          </Card>
        ) : (
          metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {activitiesLoading ? (
              <>
                <Skeleton className="h-16 w-full glass-sm" />
                <Skeleton className="h-16 w-full glass-sm" />
                <Skeleton className="h-16 w-full glass-sm" />
              </>
            ) : activitiesError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <p className="text-sm text-muted-foreground mb-4">Error al cargar actividad</p>
                <Button onClick={() => refetchActivities()} size="sm">Reintentar</Button>
              </div>
            ) : activityItems.length > 0 ? (
              activityItems.map((activity, i) => (
                <ActivityItem key={i} {...activity} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
            )}
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold mb-4">Rendimiento SLA</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Primera Respuesta</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[94%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Resolución</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[87%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Satisfacción</span>
                <span className="font-medium">96%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[96%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
