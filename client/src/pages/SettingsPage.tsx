import { FormEvent, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserRole = "agent" | "admin";

interface UserFormState {
  name: string;
  email: string;
  role: UserRole;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [primaryColor, setPrimaryColor] = useState("#1d4ed8");
  const [secondaryColor, setSecondaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#22c55e");
  const { user: authUser, session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<UserFormState>({
    name: "",
    email: "",
    role: "agent",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const authToken = session?.access_token ?? null;

  const roleOptions = useMemo(
    () => [
      { value: "agent" as UserRole, label: t("settings.users.role.agent") },
      { value: "admin" as UserRole, label: t("settings.users.role.admin") },
    ],
    [t]
  );

  const getErrorMessage = async (res: Response) => {
    const text = await res.text();

    if (!text) {
      return res.statusText || t("settings.errors.requestFailed");
    }

    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed) {
        return parsed.error || parsed.message || text;
      }
      return text;
    } catch (_error) {
      return text;
    }
  };

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery<User[], Error>({
    queryKey: ["/api/users", authToken],
    enabled: Boolean(authToken),
    queryFn: async () => {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      return (await response.json()) as User[];
    },
  });

  const currentUserRecord = useMemo(() => {
    if (!authUser?.id || !usersData) {
      return null;
    }
    return usersData.find((user) => user.id === authUser.id) || null;
  }, [authUser?.id, usersData]);

  const isAdmin = currentUserRecord?.role === "admin";

  const createUserMutation = useMutation<User, Error, UserFormState>({
    mutationFn: async (payload) => {
      if (!authToken) {
        throw new Error(t("settings.users.noSessionError"));
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      return (await response.json()) as User;
    },
    onSuccess: (createdUser) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", authToken] });
      toast({
        title: t("settings.users.toasts.createSuccessTitle"),
        description: t("settings.users.toasts.createSuccessDescription", { name: createdUser.name }),
      });
      handleUserDialogOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: t("settings.users.toasts.createErrorTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation<User, Error, { id: string; data: UserFormState }>({
    mutationFn: async ({ id, data }) => {
      if (!authToken) {
        throw new Error(t("settings.users.noSessionError"));
      }

      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      return (await response.json()) as User;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", authToken] });
      toast({
        title: t("settings.users.toasts.updateSuccessTitle"),
        description: t("settings.users.toasts.updateSuccessDescription", { name: updatedUser.name }),
      });
      handleUserDialogOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: t("settings.users.toasts.updateErrorTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  const handleUserDialogOpenChange = (open: boolean) => {
    setIsUserDialogOpen(open);

    if (!open) {
      setDialogMode("create");
      setFormState({ name: "", email: "", role: "agent" });
      setEditingUserId(null);
    }
  };

  const handleFormChange = (field: keyof UserFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: field === "role" ? (value as UserRole) : value,
    }));
  };

  const handleOpenCreate = () => {
    setDialogMode("create");
    setFormState({ name: "", email: "", role: "agent" });
    setEditingUserId(null);
    setIsUserDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setDialogMode("edit");
    setFormState({
      name: user.name,
      email: user.email,
      role: (user.role as UserRole) || "agent",
    });
    setEditingUserId(user.id);
    setIsUserDialogOpen(true);
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAdmin) {
      toast({
        title: t("settings.users.toasts.restrictedTitle"),
        description: t("settings.users.toasts.restrictedDescription"),
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === "create") {
      createUserMutation.mutate(formState);
      return;
    }

    if (dialogMode === "edit" && editingUserId) {
      updateUserMutation.mutate({ id: editingUserId, data: formState });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">{t("settings.title")}</h2>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </motion.div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="branding" data-testid="tab-branding">{t("settings.tabs.branding")}</TabsTrigger>
          <TabsTrigger value="sla" data-testid="tab-sla">{t("settings.tabs.sla")}</TabsTrigger>
          <TabsTrigger value="webhooks" data-testid="tab-webhooks">{t("settings.tabs.webhooks")}</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">{t("settings.tabs.users")}</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">{t("settings.branding.title")}</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">{t("settings.branding.primaryColor")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-20 glass-sm"
                      data-testid="input-primary-color"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 glass-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary">{t("settings.branding.secondaryColor")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-20 glass-sm"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 glass-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent">{t("settings.branding.accentColor")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-10 w-20 glass-sm"
                      data-testid="input-accent-color"
                    />
                    <Input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 glass-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button data-testid="button-save-branding">{t("settings.branding.save")}</Button>
                <Button variant="outline" className="glass-sm" data-testid="button-reset-branding">
                  {t("settings.branding.reset")}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">{t("settings.sla.title")}</h3>
            <div className="space-y-4">
              {[
                { priority: "high", firstReply: "120", resolution: "480" },
                { priority: "medium", firstReply: "480", resolution: "1440" },
                { priority: "low", firstReply: "1440", resolution: "4320" },
              ].map((sla) => (
                <div key={sla.priority} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-sm rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium">{t(`settings.sla.priorities.${sla.priority}`)}</span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t("settings.sla.firstResponse")}</Label>
                    <Input
                      type="number"
                      defaultValue={sla.firstReply}
                      className="glass-sm"
                      data-testid={`input-first-reply-${sla.priority}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t("settings.sla.resolution")}</Label>
                    <Input
                      type="number"
                      defaultValue={sla.resolution}
                      className="glass-sm"
                      data-testid={`input-resolution-${sla.priority}`}
                    />
                  </div>
                </div>
              ))}
              <Button data-testid="button-save-sla">{t("settings.sla.save")}</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">{t("settings.webhooks.title")}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inbound-key">{t("settings.webhooks.inboundKey")}</Label>
                <Input
                  id="inbound-key"
                  type="text"
                  placeholder={t("settings.webhooks.inboundPlaceholder")}
                  className="glass-sm font-mono"
                  data-testid="input-inbound-key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outbound-url">{t("settings.webhooks.outboundUrl")}</Label>
                <Input
                  id="outbound-url"
                  type="url"
                  placeholder={t("settings.webhooks.outboundPlaceholder")}
                  className="glass-sm"
                  data-testid="input-outbound-url"
                />
              </div>
              <div className="flex gap-3">
                <Button data-testid="button-save-webhooks">{t("settings.webhooks.save")}</Button>
                <Button variant="outline" className="glass-sm" data-testid="button-test-webhook">
                  {t("settings.webhooks.test")}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Dialog open={isUserDialogOpen} onOpenChange={handleUserDialogOpenChange}>
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t("settings.users.title")}</h3>
                <Button
                  onClick={handleOpenCreate}
                  data-testid="button-add-user"
                  disabled={!isAdmin}
                  variant={isAdmin ? "default" : "outline"}
                >
                  {t("settings.users.add")}
                </Button>
              </div>

              {!authToken ? (
                <p className="text-sm text-muted-foreground">
                  {t("settings.users.loginNeeded")}
                </p>
              ) : usersError ? (
                <p className="text-sm text-destructive">
                  {usersError.message}
                </p>
              ) : isUsersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {usersData && usersData.length > 0 ? (
                    usersData.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 glass-sm rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="glass-sm capitalize" data-testid={`badge-role-${user.id}`}>
                            {user.role === "admin" ? t("settings.users.role.admin") : t("settings.users.role.agent")}
                          </Badge>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(user)}
                              data-testid={`button-edit-user-${user.id}`}
                            >
                              {t("settings.users.edit")}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("settings.users.empty")}</p>
                  )}
                </div>
              )}
              {!isAdmin && authToken && !usersError && (
                <p className="mt-4 text-xs text-muted-foreground">
                  {t("settings.users.noPermissionNote")}
                </p>
              )}
            </Card>

            <DialogContent className="glass max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === "create" ? t("settings.users.dialog.createTitle") : t("settings.users.dialog.editTitle")}
                </DialogTitle>
                <DialogDescription>
                  {dialogMode === "create"
                    ? t("settings.users.dialog.createDescription")
                    : t("settings.users.dialog.editDescription")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">{t("settings.users.form.name")}</Label>
                  <Input
                    id="user-name"
                    value={formState.name}
                    onChange={(event) => handleFormChange("name", event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">{t("settings.users.form.email")}</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formState.email}
                    onChange={(event) => handleFormChange("email", event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">{t("settings.users.form.role")}</Label>
                  <Select
                    value={formState.role}
                    onValueChange={(value) => handleFormChange("role", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="user-role" className="glass-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUserDialogOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} data-testid="button-submit-user">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dialogMode === "create" ? t("settings.users.form.submitCreate") : t("settings.users.form.submitEdit")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
