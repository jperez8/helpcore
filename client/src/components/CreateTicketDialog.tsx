import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTicketForm } from "./CreateTicketForm";

export function CreateTicketDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-new-ticket">
          <Plus className="mr-2 h-4 w-4" />
          {t("tickets.newTicket")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass">
        <DialogHeader>
          <DialogTitle>{t("tickets.create.title")}</DialogTitle>
          <DialogDescription>
            {t("tickets.create.subjectPlaceholder")}
          </DialogDescription>
        </DialogHeader>
        <CreateTicketForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
