import { Badge } from "@/components/ui/badge";

type Status = "open" | "pending_customer" | "pending_agent" | "closed";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  open: {
    label: "Abierto",
    className: "glass border-blue-400/50 text-blue-600 dark:text-blue-400",
  },
  pending_customer: {
    label: "Pendiente Cliente",
    className: "glass border-amber-400/50 text-amber-600 dark:text-amber-400",
  },
  pending_agent: {
    label: "Pendiente Agente",
    className: "glass border-purple-400/50 text-purple-600 dark:text-purple-400",
  },
  closed: {
    label: "Cerrado",
    className: "glass border-green-400/50 text-green-600 dark:text-green-400",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}
