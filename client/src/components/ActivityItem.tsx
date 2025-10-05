import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItemProps {
  actor: string;
  action: string;
  entity: string;
  timestamp: Date;
  icon: LucideIcon;
}

export default function ActivityItem({
  actor,
  action,
  entity,
  timestamp,
  icon: Icon,
}: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-sm p-4 hover-elevate transition-smooth">
        <div className="flex items-start gap-3">
          <div className="glass p-2 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{actor}</span> {action}{' '}
              <span className="font-mono text-xs">{entity}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(timestamp, { addSuffix: true, locale: es })}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
