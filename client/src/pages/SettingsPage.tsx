import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState("#1d4ed8");
  const [secondaryColor, setSecondaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#22c55e");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
        <p className="text-muted-foreground">Personaliza tu sistema de soporte</p>
      </motion.div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="branding" data-testid="tab-branding">Marca</TabsTrigger>
          <TabsTrigger value="sla" data-testid="tab-sla">SLA</TabsTrigger>
          <TabsTrigger value="webhooks" data-testid="tab-webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Personalización de Marca</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Color Primario</Label>
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
                  <Label htmlFor="secondary">Color Secundario</Label>
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
                  <Label htmlFor="accent">Color de Acento</Label>
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
                <Button data-testid="button-save-branding">Guardar Cambios</Button>
                <Button variant="outline" className="glass-sm" data-testid="button-reset-branding">
                  Restaurar por Defecto
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Objetivos SLA</h3>
            <div className="space-y-4">
              {[
                { priority: "Alta", firstReply: "120", resolution: "480" },
                { priority: "Media", firstReply: "480", resolution: "1440" },
                { priority: "Baja", firstReply: "1440", resolution: "4320" },
              ].map((sla) => (
                <div key={sla.priority} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-sm rounded-lg">
                  <div className="flex items-center">
                    <span className="font-medium">{sla.priority}</span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Primera Respuesta (min)</Label>
                    <Input
                      type="number"
                      defaultValue={sla.firstReply}
                      className="glass-sm"
                      data-testid={`input-first-reply-${sla.priority.toLowerCase()}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Resolución (min)</Label>
                    <Input
                      type="number"
                      defaultValue={sla.resolution}
                      className="glass-sm"
                      data-testid={`input-resolution-${sla.priority.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
              <Button data-testid="button-save-sla">Guardar SLA</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Configuración de Webhooks</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inbound-key">API Key de Entrada</Label>
                <Input
                  id="inbound-key"
                  type="text"
                  placeholder="dev_key_123"
                  className="glass-sm font-mono"
                  data-testid="input-inbound-key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outbound-url">URL de Salida (Outbound)</Label>
                <Input
                  id="outbound-url"
                  type="url"
                  placeholder="https://ejemplo.com/webhook/reply"
                  className="glass-sm"
                  data-testid="input-outbound-url"
                />
              </div>
              <div className="flex gap-3">
                <Button data-testid="button-save-webhooks">Guardar</Button>
                <Button variant="outline" className="glass-sm" data-testid="button-test-webhook">
                  Probar Conexión
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
              <Button data-testid="button-add-user">Agregar Usuario</Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "María García", email: "maria@ejemplo.com", role: "Agente" },
                { name: "Carlos López", email: "carlos@ejemplo.com", role: "Agente" },
                { name: "Ana Martínez", email: "ana@ejemplo.com", role: "Admin" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 glass-sm rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 glass-sm rounded">{user.role}</span>
                    <Button variant="ghost" size="sm" data-testid={`button-edit-user-${i}`}>
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
