import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const DATE_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Esta Semana" },
  { value: "month", label: "Este Mês" },
  { value: "custom", label: "Personalizado" },
] as const

interface AppointmentDateFilterProps {
  dateFilter: string
  setDateFilter: (v: string) => void
  dateRange: DateRange | undefined
  setDateRange: (v: DateRange | undefined) => void
}

export function AppointmentDateFilter({
  dateFilter, setDateFilter, dateRange, setDateRange,
}: AppointmentDateFilterProps) {
  const [calOpen, setCalOpen] = useState(false)

  return (
    <div className="flex items-center gap-1.5 bg-card/40 border border-border/50 rounded-xl px-1.5 py-1 backdrop-blur-sm w-full overflow-x-auto invisible-scrollbar scroll-smooth">
      {DATE_FILTERS.map(f => (
        f.value === "custom" ? (
          <Popover key={f.value} open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={() => setDateFilter("custom")}
                className={cn(
                  "flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                  dateFilter === "custom"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <CalendarIcon className="size-3" />
                {dateFilter === "custom" && dateRange?.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "dd/MM", { locale: ptBR })} – ${format(dateRange.to, "dd/MM", { locale: ptBR })}`
                    : format(dateRange.from, "dd MMM", { locale: ptBR })
                  : "Personalizado"
                }
                <ChevronDown className="size-3 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  setDateFilter("custom")
                  // Don't close immediately to let user choose the range
                }}
                numberOfMonths={2}
                locale={ptBR}
                className="rounded-xl"
                style={{ "--accent-foreground": "0 0% 100%" } as React.CSSProperties}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <button
            key={f.value}
            onClick={() => setDateFilter(f.value)}
            className={cn(
              "h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              dateFilter === f.value
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        )
      ))}

      {dateFilter !== "all" && (
        <button
          onClick={() => {
            setDateFilter("all")
            setDateRange(undefined)
          }}
          className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          title="Limpar filtro de data"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
