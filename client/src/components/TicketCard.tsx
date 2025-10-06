import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Status = "open" | "pending_customer" | "pending_agent" | "closed";
type Priority = "low" | "medium" | "high";
type Channel = "whatsapp" | "web" | "email" | "other";

interface TicketCardProps {
  id: string;
  subject: string;
  customer: string;
  status: Status;
  priority: Priority;
  channel: Channel;
  assignee?: string;
  createdAt: Date;
  onClick?: () => void;
}

const channelIcons = {
  whatsapp: "💬",
  web: "🌐",
  email: "📧",
  other: "📝",
};

const priorityColors = {
  low: "border-l-gray-400",
  medium: "border-l-amber-400",
  high: "border-l-red-500",
};

export default function TicketCard({
  id,
  subject,
  customer,
  status,
  priority,
  channel,
  assignee,
  createdAt,
  onClick,
}: TicketCardProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("es") ? es : enUS;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card
        className={`glass p-4 border-l-4 ${priorityColors[priority]} hover-elevate active-elevate-2 cursor-pointer transition-smooth`}
        onClick={onClick}
        data-testid={`card-ticket-${id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">#{id}</span>
              <Badge variant="outline" className="text-xs">{channelIcons[channel]}</Badge>
            </div>
            <h3 className="font-semibold text-base mb-1 truncate">{subject}</h3>
            <p className="text-sm text-muted-foreground mb-3">{customer}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={status} />
              <PriorityBadge priority={priority} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {assignee && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs glass">
                  {assignee.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(createdAt, { addSuffix: true, locale })}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
