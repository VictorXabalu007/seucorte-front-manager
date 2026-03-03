import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Appointment } from "../types"

interface AppointmentStatusBadgeProps {
  status: Appointment["status"]
  payment?: Appointment["paymentStatus"]
}

const statusConfig = {
  SCHEDULED: { label: "Agendado", dot: "bg-blue-400", text: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/20" },
  CONFIRMED: { label: "Confirmado", dot: "bg-primary", text: "text-primary", bg: "bg-primary/15 border-primary/20" },
  COMPLETED: { label: "Concluído", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/20" },
  CANCELLED: { label: "Cancelado", dot: "bg-red-400", text: "text-red-400", bg: "bg-red-500/15 border-red-500/20" },
  NO_SHOW: { label: "Não Compareceu", dot: "bg-orange-400", text: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/20" },
}

const paymentConfig = {
  PENDING: { label: "Pendente", dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/20" },
  PAID: { label: "Pago", dot: "bg-primary", text: "text-primary", bg: "bg-primary/15 border-primary/20" },
  REFUNDED: { label: "Reembolsado", dot: "bg-slate-400", text: "text-slate-400", bg: "bg-slate-500/15 border-slate-500/20" },
}

export function AppointmentStatusBadge({ status, payment }: AppointmentStatusBadgeProps) {
  if (payment) {
    const cfg = paymentConfig[payment]
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold border rounded-full px-2.5 py-0.5", cfg.text, cfg.bg)}>
        <span className={cn("size-1.5 rounded-full inline-block", cfg.dot)} />
        {cfg.label}
      </span>
    )
  }

  const cfg = statusConfig[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold border rounded-full px-2.5 py-0.5", cfg.text, cfg.bg)}>
      <span className={cn("size-1.5 rounded-full inline-block", cfg.dot)} />
      {cfg.label}
    </span>
  )
}
