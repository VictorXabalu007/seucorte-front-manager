import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Appointment } from "../types"

interface AppointmentDeleteAlertProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onConfirm: () => void
}

export function AppointmentDeleteAlert({
  isOpen,
  onOpenChange,
  appointment,
  onConfirm,
}: AppointmentDeleteAlertProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="size-5 text-red-400" />
            </div>
            Excluir Agendamento
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm pt-2">
            Você tem certeza que deseja excluir o agendamento de{" "}
            <span className="text-white font-bold">{appointment?.clientName}</span>
            {appointment && (
              <span className="block mt-1 text-xs text-slate-500">
                {appointment.date} • {appointment.startTime}–{appointment.endTime} • {appointment.professionalName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-slate-300 hover:bg-muted"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20"
          >
            Sim, excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
