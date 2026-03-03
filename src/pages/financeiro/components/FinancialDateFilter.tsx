import * as React from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface FinancialDateFilterProps {
  dateFilter: "month" | "week" | "custom"
  setDateFilter: (filter: "month" | "week" | "custom") => void
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

export function FinancialDateFilter({
  dateFilter,
  setDateFilter,
  dateRange,
  setDateRange,
}: FinancialDateFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelectMonth = () => {
    setDateFilter("month")
    const now = new Date()
    setDateRange({
      from: startOfMonth(now),
      to: endOfMonth(now),
    })
  }

  const handleSelectWeek = () => {
    setDateFilter("week")
    const now = new Date()
    setDateRange({
      from: startOfWeek(now, { weekStartsOn: 0 }),
      to: endOfWeek(now, { weekStartsOn: 0 }),
    })
  }

  const handleCustomRange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      setDateFilter("custom")
      // We don't close immediately to allow the user to see the selection
    }
  }

  return (
    <div className="flex items-center gap-1.5 bg-card/40 border border-border/50 rounded-xl p-1.5 backdrop-blur-sm shadow-sm shrink-0 overflow-x-auto invisible-scrollbar">
      <Button
        variant="ghost"
        onClick={handleSelectMonth}
        className={cn(
          "h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
          dateFilter === "month"
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Mês
      </Button>

      <Button
        variant="ghost"
        onClick={handleSelectWeek}
        className={cn(
          "h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
          dateFilter === "week"
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Semana
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
              dateFilter === "custom"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
            )}
            onClick={() => setDateFilter("custom")}
          >
            <CalendarIcon className="size-3.5" />
            {dateFilter === "custom" && dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd/MM", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM", { locale: ptBR })
              )
            ) : (
              "Personalizado"
            )}
            <ChevronDown className={cn("size-3 opacity-50 transition-transform", isOpen && "rotate-180")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleCustomRange}
            numberOfMonths={2}
            locale={ptBR}
            className="p-3"
          />
        </PopoverContent>
      </Popover>

      {dateFilter !== "month" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSelectMonth}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          title="Limpar filtro de data"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
