import { Badge } from "@/components/ui/badge";

type Priority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig = {
  low: {
    label: "Baja",
    className: "glass border-gray-400/50 text-gray-600 dark:text-gray-400",
  },
  medium: {
    label: "Media",
    className: "glass border-amber-400/50 text-amber-600 dark:text-amber-400",
  },
  high: {
    label: "Alta",
    className: "glass border-red-400/50 text-red-600 dark:text-red-400",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <Badge className={config.className} data-testid={`badge-priority-${priority}`}>
      {config.label}
    </Badge>
  );
}
