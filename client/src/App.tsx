import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TicketListPage from "@/pages/TicketListPage";
import TicketDetailPage from "@/pages/TicketDetailPage";
import ActivityLogPage from "@/pages/ActivityLogPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => setLocation("/")} />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto max-w-7xl">
              <Switch>
                <Route path="/" component={DashboardPage} />
                <Route path="/tickets">
                  <TicketListPage
                    onTicketClick={(id) => setLocation(`/tickets/${id}`)}
                    onCreateTicket={() => setLocation("/tickets/new")}
                  />
                </Route>
                <Route path="/tickets/:id">
                  <TicketDetailPage onBack={() => setLocation("/tickets")} />
                </Route>
                <Route path="/activity" component={ActivityLogPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <AppContent />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
