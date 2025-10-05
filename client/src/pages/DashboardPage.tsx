import MetricCard from "@/components/MetricCard";
import ActivityItem from "@/components/ActivityItem";
import { Card } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle, TrendingUp, MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  //todo: remove mock functionality
  const metrics = [
    { title: "Tickets Abiertos", value: 24, icon: Ticket, trend: { value: 12, isPositive: false } },
    { title: "MTPR Promedio", value: "15m", icon: Clock, trend: { value: 8, isPositive: true } },
    { title: "Resueltos Hoy", value: 18, icon: CheckCircle, trend: { value: 5, isPositive: true } },
    { title: "SLA Cumplido", value: "94%", icon: TrendingUp },
  ];

  const activities = [
    { actor: "María García", action: "respondió al ticket", entity: "#TK-001", timestamp: new Date(Date.now() - 1000 * 60 * 5), icon: MessageSquare },
    { actor: "Carlos López", action: "fue asignado al ticket", entity: "#TK-002", timestamp: new Date(Date.now() - 1000 * 60 * 15), icon: UserPlus },
    { actor: "Ana Martínez", action: "cerró el ticket", entity: "#TK-003", timestamp: new Date(Date.now() - 1000 * 60 * 30), icon: CheckCircle },
    { actor: "Sistema", action: "cambió la prioridad del ticket", entity: "#TK-004", timestamp: new Date(Date.now() - 1000 * 60 * 60), icon: AlertCircle },
  ];

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
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
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
