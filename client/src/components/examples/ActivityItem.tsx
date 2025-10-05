import ActivityItem from '../ActivityItem';
import { MessageSquare, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function ActivityItemExample() {
  return (
    <div className="space-y-3 p-4 max-w-2xl">
      <ActivityItem
        actor="María García"
        action="respondió al ticket"
        entity="#TK-001"
        timestamp={new Date(Date.now() - 1000 * 60 * 5)}
        icon={MessageSquare}
      />
      <ActivityItem
        actor="Carlos López"
        action="fue asignado al ticket"
        entity="#TK-002"
        timestamp={new Date(Date.now() - 1000 * 60 * 15)}
        icon={UserPlus}
      />
      <ActivityItem
        actor="Ana Martínez"
        action="cerró el ticket"
        entity="#TK-003"
        timestamp={new Date(Date.now() - 1000 * 60 * 30)}
        icon={CheckCircle}
      />
      <ActivityItem
        actor="Sistema"
        action="cambió la prioridad del ticket"
        entity="#TK-004"
        timestamp={new Date(Date.now() - 1000 * 60 * 60)}
        icon={AlertCircle}
      />
    </div>
  );
}
