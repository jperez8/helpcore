import { useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
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
import { ArrowLeft, Send, Paperclip, User } from "lucide-react";
import { motion } from "framer-motion";

interface TicketDetailPageProps {
  onBack?: () => void;
}

export default function TicketDetailPage({ onBack }: TicketDetailPageProps) {
  const [replyText, setReplyText] = useState("");

  //todo: remove mock functionality
  const ticket = {
    id: "TK-001",
    subject: "¿Cuánto tarda cambiar la pantalla del iPhone 12?",
    status: "open" as const,
    priority: "high" as const,
    channel: "whatsapp" as const,
    customer: {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      phone: "+34 612 345 678",
    },
    assignee: "María García",
  };

  const messages = [
    {
      text: "¿Cuánto tarda cambiar la pantalla del iPhone 12?",
      authorType: "customer" as const,
      authorName: "Juan Pérez",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      text: "Ticket asignado a María García",
      authorType: "system" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      text: "Hola Juan, el cambio de pantalla para iPhone 12 tarda aproximadamente 45 minutos. Tenemos disponibilidad hoy mismo.",
      authorType: "agent" as const,
      authorName: "María García",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      attachments: [{ name: "presupuesto.pdf", url: "#" }],
    },
    {
      text: "Perfecto, ¿cuál es el precio?",
      authorType: "customer" as const,
      authorName: "Juan Pérez",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ];

  const handleSendReply = () => {
    console.log("Send reply:", replyText);
    setReplyText("");
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
            <p className="text-sm text-muted-foreground font-mono">#{ticket.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <Badge variant="outline" className="glass-sm">📱 {ticket.channel}</Badge>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} {...msg} />
            ))}
          </div>

          <div className="glass border-t border-white/10 p-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Escribe tu respuesta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="glass-sm border-white/10 min-h-[80px] resize-none"
                data-testid="textarea-reply"
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="glass-sm" data-testid="button-attach">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Adjuntar
                </Button>
                <Button onClick={handleSendReply} data-testid="button-send">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="glass w-80 border-l border-white/10 p-4 space-y-4 overflow-y-auto hidden lg:block">
          <div>
            <h3 className="text-sm font-semibold mb-3">Cliente</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="glass">JP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{ticket.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{ticket.customer.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{ticket.customer.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Asignado a</h3>
            <Select defaultValue="maria">
              <SelectTrigger className="glass-sm" data-testid="select-assignee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="maria">María García</SelectItem>
                <SelectItem value="carlos">Carlos López</SelectItem>
                <SelectItem value="ana">Ana Martínez</SelectItem>
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
