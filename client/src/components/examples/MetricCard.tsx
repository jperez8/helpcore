import MetricCard from '../MetricCard';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Tickets Abiertos"
        value={24}
        icon={Ticket}
        trend={{ value: 12, isPositive: false }}
      />
      <MetricCard
        title="MTPR Promedio"
        value="15m"
        icon={Clock}
        trend={{ value: 8, isPositive: true }}
      />
      <MetricCard
        title="Resueltos Hoy"
        value={18}
        icon={CheckCircle}
        trend={{ value: 5, isPositive: true }}
      />
      <MetricCard
        title="SLA Cumplido"
        value="94%"
        icon={AlertCircle}
      />
    </div>
  );
}
