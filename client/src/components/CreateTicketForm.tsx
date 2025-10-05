import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { insertTicketSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = insertTicketSchema.extend({
  customerEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  initialMessage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTicketFormProps {
  onSuccess?: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      priority: "medium",
      channel: "web",
      status: "open",
      initialMessage: "",
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { initialMessage, ...ticketData } = data;
      const response = await apiRequest("POST", "/api/tickets", {
        ...ticketData,
        initialMessage: initialMessage || undefined,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: t("common.success"),
        description: t("tickets.create.success"),
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("tickets.create.error"),
        variant: "destructive",
      });
      console.error("Error creating ticket:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    createTicketMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tickets.create.subject")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("tickets.create.subjectPlaceholder")}
                  {...field}
                  data-testid="input-subject"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tickets.create.customerName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("tickets.create.customerNamePlaceholder")}
                    {...field}
                    data-testid="input-customer-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tickets.create.customerEmail")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("tickets.create.customerEmailPlaceholder")}
                    {...field}
                    data-testid="input-customer-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tickets.create.customerPhone")}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={t("tickets.create.customerPhonePlaceholder")}
                  {...field}
                  value={field.value || ""}
                  data-testid="input-customer-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tickets.create.priority")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue placeholder={t("tickets.create.selectPriority")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low" data-testid="option-priority-low">
                      {t("tickets.priority.low")}
                    </SelectItem>
                    <SelectItem value="medium" data-testid="option-priority-medium">
                      {t("tickets.priority.medium")}
                    </SelectItem>
                    <SelectItem value="high" data-testid="option-priority-high">
                      {t("tickets.priority.high")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tickets.create.channel")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-channel">
                      <SelectValue placeholder={t("tickets.create.selectChannel")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="web" data-testid="option-channel-web">
                      {t("tickets.channel.web")}
                    </SelectItem>
                    <SelectItem value="email" data-testid="option-channel-email">
                      {t("tickets.channel.email")}
                    </SelectItem>
                    <SelectItem value="whatsapp" data-testid="option-channel-whatsapp">
                      {t("tickets.channel.whatsapp")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="initialMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tickets.create.initialMessage")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("tickets.create.initialMessagePlaceholder")}
                  className="min-h-[100px]"
                  {...field}
                  data-testid="textarea-initial-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={createTicketMutation.isPending}
            data-testid="button-create-ticket"
          >
            {createTicketMutation.isPending
              ? t("tickets.create.creating")
              : t("tickets.create.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
