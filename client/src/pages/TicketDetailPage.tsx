import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MessageBubble from "@/components/MessageBubble";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Paperclip, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Ticket, Message } from "@shared/schema";

interface TicketDetailPageProps {
  onBack?: () => void;
}

type TicketStatus = "open" | "pending_customer" | "pending_agent" | "closed";
type TicketPriority = "low" | "medium" | "high";

const STATUS_OPTIONS: Array<{ value: TicketStatus; labelKey: string; descriptionKey: string }> = [
  { value: "open", labelKey: "tickets.details.statusOptions.open", descriptionKey: "tickets.details.statusDescriptions.open" },
  { value: "pending_agent", labelKey: "tickets.details.statusOptions.pending_agent", descriptionKey: "tickets.details.statusDescriptions.pending_agent" },
  { value: "pending_customer", labelKey: "tickets.details.statusOptions.pending_customer", descriptionKey: "tickets.details.statusDescriptions.pending_customer" },
  { value: "closed", labelKey: "tickets.details.statusOptions.closed", descriptionKey: "tickets.details.statusDescriptions.closed" },
];

const PRIORITY_OPTIONS: Array<{ value: TicketPriority; labelKey: string; descriptionKey: string }> = [
  { value: "low", labelKey: "tickets.details.priorityOptions.low", descriptionKey: "tickets.details.priorityDescriptions.low" },
  { value: "medium", labelKey: "tickets.details.priorityOptions.medium", descriptionKey: "tickets.details.priorityDescriptions.medium" },
  { value: "high", labelKey: "tickets.details.priorityOptions.high", descriptionKey: "tickets.details.priorityDescriptions.high" },
];

export default function TicketDetailPage({ onBack }: TicketDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [replyText, setReplyText] = useState("");
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null);
  const [pendingPriority, setPendingPriority] = useState<TicketPriority | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery<{ ticket: Ticket; messages: Message[] }>({
    queryKey: [`/api/tickets/${id}`],
    enabled: !!id,
  });

  const sendMessageMutation = useMutation<Message, Error, string>({
    mutationFn: async (text: string) => {
      const payload = {
        text,
        authorType: user ? "agent" : "customer",
        authorName: actorName,
        authorId: actorId,
      };
      const response = await apiRequest("POST", `/api/tickets/${id}/messages`, payload);
      return (await response.json()) as Message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${id}`] });
      setReplyText("");
      toast({
        title: t("common.success"),
        description: t("tickets.details.messageSent"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("tickets.details.messageError"),
        variant: "destructive",
      });
    },
  });

  const actorName = user
    ? ((user?.user_metadata as { full_name?: string } | undefined)?.full_name || user.email || t("tickets.details.agentFallback"))
    : t("tickets.details.customerFallback");
  const actorId = user?.id ?? null;

  const updateStatusMutation = useMutation<Ticket, Error, TicketStatus>({
    mutationFn: async (newStatus) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}/status`, {
        status: newStatus,
        actorName,
        actorId,
      });
      return (await response.json()) as Ticket;
    },
    onMutate: (newStatus) => {
      setPendingStatus(newStatus);
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData([`/api/tickets/${id}`], (prev) => {
        if (!prev) return prev;
        return { ...prev, ticket: updatedTicket };
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: t("common.success"),
        description: t("tickets.details.statusUpdated", {
          status: t(
            STATUS_OPTIONS.find((opt) => opt.value === updatedTicket.status)?.labelKey ?? "tickets.details.statusOptions.open"
          ),
        }),
      });
    },
    onError: (mutationError) => {
      toast({
        title: t("common.error"),
        description: mutationError instanceof Error
          ? mutationError.message
          : t("tickets.details.statusUpdateError"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setPendingStatus(null);
    },
  });

  const updatePriorityMutation = useMutation<Ticket, Error, TicketPriority>({
    mutationFn: async (newPriority) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}/priority`, {
        priority: newPriority,
        actorName,
        actorId,
      });
      return (await response.json()) as Ticket;
    },
    onMutate: (newPriority) => {
      setPendingPriority(newPriority);
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData([`/api/tickets/${id}`], (prev) => {
        if (!prev) return prev;
        return { ...prev, ticket: updatedTicket };
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: t("common.success"),
        description: t("tickets.details.priorityUpdated", {
          priority: t(
            PRIORITY_OPTIONS.find((opt) => opt.value === updatedTicket.priority)?.labelKey ?? "tickets.details.priorityOptions.medium"
          ),
        }),
      });
    },
    onError: (mutationError) => {
      toast({
        title: t("common.error"),
        description: mutationError instanceof Error
          ? mutationError.message
          : t("tickets.details.priorityUpdateError"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setPendingPriority(null);
    },
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    sendMessageMutation.mutate(replyText);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="glass p-8 text-center m-6">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-lg font-semibold mb-2">{t("tickets.errors.detailTitle")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : t("tickets.errors.detailDescription")}
        </p>
        <Button onClick={onBack}>{t("common.back")}</Button>
      </Card>
    );
  }

  const { ticket, messages } = data;


  const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map((option) => ({
      ...option,
      label: t(option.labelKey),
      description: t(option.descriptionKey),
    })),
    [t]
  );

  const priorityOptions = useMemo(
    () => PRIORITY_OPTIONS.map((option) => ({
      ...option,
      label: t(option.labelKey),
      description: t(option.descriptionKey),
    })),
    [t]
  );

  const currentStatus = (pendingStatus ?? ticket.status) as TicketStatus;
  const currentPriority = (pendingPriority ?? ticket.priority) as TicketPriority;
  const statusOption = statusOptions.find((option) => option.value === currentStatus);
  const priorityOption = priorityOptions.find((option) => option.value === currentPriority);
  const channelLabel = t(`tickets.channel.${ticket.channel}`, { defaultValue: ticket.channel });

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass border-b border-white/10 p-4"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{ticket.subject}</h2>
            <p className="text-sm text-muted-foreground font-mono">#{ticket.ticketNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={ticket.status as any} />
          <PriorityBadge priority={ticket.priority as any} />
          <Badge variant="outline" className="glass-sm">
            {channelLabel}
          </Badge>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {t("tickets.details.noMessages")}
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  text={msg.text}
                  authorType={msg.authorType as any}
                  authorName={msg.authorName || undefined}
                  timestamp={new Date(msg.createdAt)}
                  attachments={msg.attachments as any}
                />
              ))
            )}
          </div>

          <div className="glass border-t border-white/10 p-4">
            <div className="space-y-3">
              <Textarea
                placeholder={t("tickets.details.typeMessage")}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="glass-sm border-white/10 min-h-[80px] resize-none"
                data-testid="textarea-reply"
                disabled={sendMessageMutation.isPending}
              />
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass-sm" 
                  data-testid="button-attach"
                  disabled
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  {t("tickets.details.attach")}
                </Button>
                <Button 
                  onClick={handleSendReply} 
                  data-testid="button-send"
                  disabled={!replyText.trim() || sendMessageMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendMessageMutation.isPending ? t("tickets.details.sending") : t("tickets.details.send")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="glass w-80 border-l border-white/10 p-4 space-y-4 overflow-y-auto hidden lg:block">
          <div>
            <h3 className="text-sm font-semibold mb-3">{t("tickets.details.customer")}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="glass">
                    {getUserInitials(ticket.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{ticket.customerName}</p>
                  {ticket.customerEmail && (
                    <p className="text-xs text-muted-foreground">{ticket.customerEmail}</p>
                  )}
                </div>
              </div>
              {ticket.customerPhone && (
                <p className="text-sm text-muted-foreground">{ticket.customerPhone}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("tickets.details.assignee")}</h3>
            <Select value={ticket.assigneeId || "unassigned"} disabled>
              <SelectTrigger className="glass-sm" data-testid="select-assignee">
                <SelectValue placeholder={t("tickets.details.unassigned")} />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="unassigned">{t("tickets.details.unassigned")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("tickets.details.quickActions.title")}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t("tickets.details.quickActions.status")}</p>
                <Select
                  value={currentStatus}
                  onValueChange={(value) => {
                    const nextStatus = value as TicketStatus;
                    const active = pendingStatus ?? (ticket.status as TicketStatus);
                    if (nextStatus === active) return;
                    updateStatusMutation.mutate(nextStatus);
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                <SelectTrigger className="glass-sm w-full justify-between" data-testid="select-status-change">
                  <span className="truncate text-sm font-medium">
                    {statusOption?.label ?? currentStatus}
                  </span>
                </SelectTrigger>
                  <SelectContent className="glass max-h-60">
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t("tickets.details.quickActions.priority")}</p>
                <Select
                  value={currentPriority}
                  onValueChange={(value) => {
                    const nextPriority = value as TicketPriority;
                    const active = pendingPriority ?? (ticket.priority as TicketPriority);
                    if (nextPriority === active) return;
                    updatePriorityMutation.mutate(nextPriority);
                  }}
                  disabled={updatePriorityMutation.isPending}
                >
                <SelectTrigger className="glass-sm w-full justify-between" data-testid="select-priority-change">
                  <span className="truncate text-sm font-medium">
                    {priorityOption?.label ?? currentPriority}
                  </span>
                </SelectTrigger>
                  <SelectContent className="glass max-h-60">
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
