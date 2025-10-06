import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Moon, Sun, Bell, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { Ticket as TicketType } from "@shared/schema";
import { useLocation } from "wouter";
import SearchResultsPanel from "@/components/SearchResultsPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<TicketType[]>({
    queryKey: ["/api/tickets"],
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('nav.logout'),
        description: t('auth.logoutSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('auth.logoutError'),
        variant: "destructive",
      });
    }
  };

  const defaultInitial = t('common.unknownInitial');

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      const parts = fullName.split(' ');
      return parts.map((p: string) => p[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || defaultInitial;
  };

  const showResults = isFocused && query.trim().length > 0;

  const handleSelectTicket = (ticketId: string) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/tickets/${ticketId}`);
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t('dashboard.title')}
          </h1>
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              placeholder={t('common.search')}
              className="pl-10 glass border-white/10"
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay to allow click events
                setTimeout(() => setIsFocused(false), 150);
              }}
              data-testid="input-search"
            />

            <SearchResultsPanel
              isOpen={showResults}
              query={query}
              tickets={tickets}
              isLoading={ticketsLoading}
              onSelect={handleSelectTicket}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="glass-sm"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="glass-sm relative" data-testid="button-notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="glass-sm gap-2" data-testid="button-user-menu">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs glass">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{user?.user_metadata?.full_name || t('common.userFallback')}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-item-profile">{t('settings.profile')}</DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-settings">{t('settings.title')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                <LogOut className="mr-2 h-4 w-4" />
                {t('nav.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
