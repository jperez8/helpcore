import { useState } from "react";
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

export default function TicketDetailPage({ onBack }: TicketDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [replyText, setReplyText] = useState("");
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<{ ticket: Ticket; messages: Message[] }>({
    queryKey: [`/api/tickets/${id}`],
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest("POST", `/api/tickets/${id}/messages`, { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${id}`] });
      setReplyText("");
      toast({
        title: t("common.success"),
        description: "Mensaje enviado correctamente",
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
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
        <h3 className="text-lg font-semibold mb-2">Error al cargar el ticket</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "No se pudo cargar la información del ticket"}
        </p>
        <Button onClick={onBack}>Volver</Button>
      </Card>
    );
  }

  const { ticket, messages } = data;


  const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
            {ticket.channel}
          </Badge>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No hay mensajes en este ticket
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
                  Adjuntar
                </Button>
                <Button 
                  onClick={handleSendReply} 
                  data-testid="button-send"
                  disabled={!replyText.trim() || sendMessageMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendMessageMutation.isPending ? "Enviando..." : t("tickets.details.sendMessage")}
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
            <h3 className="text-sm font-semibold mb-3">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full glass-sm justify-start" data-testid="button-change-status">
                Cambiar Estado
              </Button>
              <Button variant="outline" className="w-full glass-sm justify-start" data-testid="button-change-priority">
                Cambiar Prioridad
              </Button>
              <Button variant="outline" className="w-full glass-sm justify-start" data-testid="button-use-template">
                Usar Plantilla
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
