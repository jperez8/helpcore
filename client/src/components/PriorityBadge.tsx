import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type Priority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { labelKey: string; className: string }> = {
  low: {
    labelKey: "tickets.details.priorityOptions.low",
    className: "glass border-gray-400/50 text-gray-600 dark:text-gray-400",
  },
  medium: {
    labelKey: "tickets.details.priorityOptions.medium",
    className: "glass border-amber-400/50 text-amber-600 dark:text-amber-400",
  },
  high: {
    labelKey: "tickets.details.priorityOptions.high",
    className: "glass border-red-400/50 text-red-600 dark:text-red-400",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const config = priorityConfig[priority];
  
  return (
    <Badge className={config.className} data-testid={`badge-priority-${priority}`}>
      {t(config.labelKey)}
    </Badge>
  );
}
