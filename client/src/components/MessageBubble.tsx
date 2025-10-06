import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type AuthorType = "customer" | "agent" | "system";

interface MessageBubbleProps {
  text: string;
  authorType: AuthorType;
  authorName?: string;
  timestamp: Date;
  attachments?: Array<{ name: string; url: string }>;
}

export default function MessageBubble({
  text,
  authorType,
  authorName,
  timestamp,
  attachments,
}: MessageBubbleProps) {
  const { i18n, t } = useTranslation();
  const isAgent = authorType === "agent";
  const isSystem = authorType === "system";
  const locale = i18n.language.startsWith("es") ? es : enUS;
  const fallbackInitial = t("common.unknownInitial");

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center my-4"
      >
        <Card className="glass-sm px-4 py-2 max-w-md">
          <p className="text-sm text-center text-muted-foreground">{text}</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 mb-4 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="glass text-xs">
          {authorName?.split(' ').map(n => n[0]).join('') || fallbackInitial}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 max-w-lg ${isAgent ? 'items-end' : 'items-start'} flex flex-col`}>
        <Card className={`glass p-3 ${isAgent ? 'bg-primary/10' : ''}`}>
          <p className="text-sm">{text}</p>
          {attachments && attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  className="text-xs text-primary hover:underline block"
                  data-testid={`link-attachment-${i}`}
                >
                  📎 {file.name}
                </a>
              ))}
            </div>
          )}
        </Card>
        <span className="text-xs text-muted-foreground mt-1">
          {format(timestamp, "HH:mm", { locale })}
        </span>
      </div>
    </motion.div>
  );
}
