import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type Status = "open" | "pending_customer" | "pending_agent" | "closed";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { labelKey: string; className: string }> = {
  open: {
    labelKey: "tickets.details.statusOptions.open",
    className: "glass border-blue-400/50 text-blue-600 dark:text-blue-400",
  },
  pending_customer: {
    labelKey: "tickets.details.statusOptions.pending_customer",
    className: "glass border-amber-400/50 text-amber-600 dark:text-amber-400",
  },
  pending_agent: {
    labelKey: "tickets.details.statusOptions.pending_agent",
    className: "glass border-purple-400/50 text-purple-600 dark:text-purple-400",
  },
  closed: {
    labelKey: "tickets.details.statusOptions.closed",
    className: "glass border-green-400/50 text-green-600 dark:text-green-400",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className} data-testid={`badge-status-${status}`}>
      {t(config.labelKey)}
    </Badge>
  );
}
