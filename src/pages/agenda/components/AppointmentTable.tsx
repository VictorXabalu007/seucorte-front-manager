import { Edit2, Trash2, Phone, ChevronLeft, ChevronRight, ShoppingCart, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Appointment } from "../types"
import { AppointmentStatusBadge } from "./AppointmentStatusBadge"

interface AppointmentTableProps {
  appointments: Appointment[]
  totalAppointments: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  onEdit: (a: Appointment) => void
  onDelete: (a: Appointment) => void
  onCheckout: (a: Appointment) => void
}

export function AppointmentTable({
  appointments, totalAppointments, currentPage, totalPages, itemsPerPage,
  setCurrentPage, onEdit, onDelete, onCheckout,
}: AppointmentTableProps) {
  return (
    <div className="bg-card/40 rounded-3xl border border-border shadow-sm overflow-hidden backdrop-blur-sm">
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 font-black">
            <TableRow className="border-border">
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 pl-8">Cliente</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Barbeiro</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Serviço</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Data & Hora</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Pagamento</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Valor</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((a) => {
                const profColor = getProfColor(a.professionalId)
                return (
                  <TableRow key={a.id} className="border-border hover:bg-muted/20 transition-colors group">
                    <TableCell className="py-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border shrink-0">
                          {a.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground line-clamp-1 flex items-center gap-1.5">
                            {a.clientName}
                            {a.hasActivePlan && (
                              <span title={`Assinante: ${a.planName || "Plano Ativo"}`} className="flex items-center">
                                <Crown className="size-3.5 text-amber-500 fill-amber-500 drop-shadow-sm" />
                              </span>
                            )}
                          </p>
                          {a.clientPhone && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="size-2.5" />{a.clientPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full inline-block" style={{ backgroundColor: profColor }} />
                        <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">{a.professionalName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm font-semibold text-foreground whitespace-nowrap">{a.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{a.serviceDuration} min</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm font-medium text-foreground whitespace-nowrap">{a.date}</p>
                      <p className="text-xs text-muted-foreground">{a.startTime} – {a.endTime}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <AppointmentStatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="py-4">
                      <AppointmentStatusBadge status={a.status} payment={a.paymentStatus} />
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm font-bold text-foreground tabular-nums whitespace-nowrap">
                        {a.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 pr-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                          <Button
                            variant="ghost" size="icon"
                            className="size-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                            title="Finalizar (PDV)"
                            onClick={() => onCheckout(a)}
                          >
                            <ShoppingCart className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="icon"
                          className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                          onClick={() => onEdit(a)}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                          <Button
                            variant="ghost" size="icon"
                            className="size-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            onClick={() => onDelete(a)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground text-sm font-medium">
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View (Mobile) */}
      <div className="md:hidden divide-y divide-border/50">
        {appointments.length > 0 ? (
          appointments.map((a) => (
            <div key={a.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                    {a.initials}
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight flex items-center gap-1.5">
                      {a.clientName}
                      {a.hasActivePlan && (
                        <span title={`Assinante: ${a.planName || "Plano Ativo"}`} className="flex items-center">
                          <Crown className="size-3.5 text-amber-500 fill-amber-500 drop-shadow-sm" />
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="size-2 rounded-full" style={{ backgroundColor: getProfColor(a.professionalId) }} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{a.professionalName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                    <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => onCheckout(a)} title="Finalizar (PDV)">
                      <ShoppingCart className="size-4 text-emerald-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => onEdit(a)}>
                    <Edit2 className="size-4 text-primary" />
                  </Button>
                  {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                    <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => onDelete(a)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Serviço</p>
                  <p className="text-xs font-bold line-clamp-1">{a.serviceName}</p>
                  <p className="text-[10px] text-muted-foreground">{a.serviceDuration} min</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Valor</p>
                  <p className="text-sm font-black text-primary">
                    {a.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-foreground">{a.date}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{a.startTime} – {a.endTime}</p>
                </div>
                <div className="flex gap-2">
                  <AppointmentStatusBadge status={a.status} />
                  <AppointmentStatusBadge status={a.status} payment={a.paymentStatus} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm font-medium">
            Nenhum agendamento encontrado.
          </div>
        )}
      </div>

      {/* Pagination footer */}
      <div className="p-5 border-t border-border/50 bg-muted/20 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-muted-foreground">
          Mostrando{" "}
          <span className="text-foreground font-bold">
            {appointments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, totalAppointments)}
          </span>{" "}
          de <span className="text-foreground font-bold">{totalAppointments}</span> agendamentos
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="size-8 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-8 rounded-lg text-xs font-bold transition-all",
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {page}
              </button>
            ))}
            <Button
              variant="ghost" size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="size-8 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function getProfColor(id: string): string {
  const colors: Record<string, string> = {
    p1: "#baf91a", p2: "#876dff", p3: "rgba(186, 249, 26, 0.1)", p4: "#ffffff",
  }
  return colors[id] || "#94A3B8"
}
