import { useQuery } from "@tanstack/react-query";
import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, UserPlus, CheckCircle, AlertCircle, Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type { ActivityLog } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function ActivityLogPage() {
  const { t } = useTranslation();
  const { data: activities = [], isLoading, isError, refetch } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity"],
  });

  const activityItems = activities.map(activity => ({
    actor: activity.actor,
    action: activity.action,
    entity: activity.entity,
    timestamp: new Date(activity.createdAt),
    icon: activity.action.includes("respondió") ? MessageSquare :
          activity.action.includes("asignado") ? UserPlus :
          activity.action.includes("cerró") || activity.action.includes("creó") ? CheckCircle :
          activity.action.includes("actualizó") || activity.action.includes("cambió") ? Edit :
          activity.action.includes("eliminó") ? Trash :
          AlertCircle,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">{t("activity.title")}</h2>
        <p className="text-muted-foreground">{t("activity.subtitle")}</p>
      </motion.div>

      <div className="glass p-4 rounded-lg">
        <div className="flex gap-3 flex-wrap">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] glass-sm" data-testid="select-event-type">
              <SelectValue placeholder={t("activity.filters.eventType.placeholder")} />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">{t("activity.filters.eventType.all")}</SelectItem>
              <SelectItem value="created">{t("activity.filters.eventType.created")}</SelectItem>
              <SelectItem value="replied">{t("activity.filters.eventType.replied")}</SelectItem>
              <SelectItem value="assigned">{t("activity.filters.eventType.assigned")}</SelectItem>
              <SelectItem value="status_changed">{t("activity.filters.eventType.statusChanged")}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[200px] glass-sm" data-testid="select-date-range">
              <SelectValue placeholder={t("activity.filters.dateRange.placeholder")} />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="today">{t("activity.filters.dateRange.today")}</SelectItem>
              <SelectItem value="week">{t("activity.filters.dateRange.week")}</SelectItem>
              <SelectItem value="month">{t("activity.filters.dateRange.month")}</SelectItem>
              <SelectItem value="all">{t("activity.filters.dateRange.all")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="glass-sm" data-testid="button-export">
            {t("activity.export")}
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
            <Skeleton className="h-20 w-full glass-sm" />
          </>
        ) : isError ? (
          <Card className="glass p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">{t("activity.error.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("activity.error.description")}</p>
            <Button onClick={() => refetch()}>{t("common.retry")}</Button>
          </Card>
        ) : activityItems.length > 0 ? (
          activityItems.map((activity, i) => (
            <ActivityItem key={i} {...activity} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">{t("activity.empty")}</p>
        )}
      </motion.div>
    </div>
  );
}
