import { Home, Ticket, Activity, Settings, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const menuItems = [
  { titleKey: "nav.dashboard", url: "/", icon: Home, testId: "dashboard" },
  { titleKey: "nav.tickets", url: "/tickets", icon: Ticket, testId: "tickets" },
  { titleKey: "nav.activity", url: "/activity", icon: Activity, testId: "activity" },
  { titleKey: "nav.settings", url: "/settings", icon: Settings, testId: "settings" },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarContent className="glass">
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.mainMenu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.testId}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="button-new-ticket">
                  <a href="/tickets/new">
                    <Plus className="h-4 w-4" />
                    <span>{t("tickets.newTicket")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
