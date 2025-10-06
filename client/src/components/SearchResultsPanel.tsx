import { useMemo } from "react";
import type { Ticket as TicketType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface SearchResultsPanelProps {
  isOpen: boolean;
  query: string;
  tickets: TicketType[];
  isLoading: boolean;
  onSelect: (ticketId: string) => void;
}

export function SearchResultsPanel({ isOpen, query, tickets, isLoading, onSelect }: SearchResultsPanelProps) {
  const { t } = useTranslation();

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [] as TicketType[];
    return tickets
      .filter(ticket => {
        const values = [
          ticket.subject,
          ticket.ticketNumber,
          ticket.customerName ?? "",
          ticket.customerEmail ?? "",
        ];
        return values.some(value => value?.toLowerCase().includes(normalized));
      })
      .slice(0, 6);
  }, [tickets, query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 mt-2 rounded-lg border border-white/10 shadow-lg z-50 p-3 space-y-2 bg-background">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 glass-sm" />
          <Skeleton className="h-12 glass-sm" />
        </div>
      ) : results.length > 0 ? (
        results.map(ticket => (
          <button
            key={ticket.id}
            type="button"
            onMouseDown={() => onSelect(ticket.id)}
            className="w-full text-left glass-sm px-4 py-3 rounded-md border border-white/10 hover:bg-white/10 transition-colors"
            data-testid={`search-result-${ticket.id}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium truncate">{ticket.subject}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Badge variant="outline" className="glass-sm font-mono">#{ticket.ticketNumber}</Badge>
                  {ticket.customerName && <span className="truncate">{ticket.customerName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status as any} />
                <PriorityBadge priority={ticket.priority as any} />
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="text-sm text-muted-foreground px-2 py-4 text-center">
          {t('common.noMatches')}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPanel;
