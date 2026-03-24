import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Selecione a hora",
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Split value ("HH:mm") into hours and minutes
  const hours = value ? value.split(":")[0] : ""
  const minutes = value ? value.split(":")[1] : ""

  const handleHourChange = (newHour: string) => {
    const currentMinutes = minutes || "00"
    onChange(`${newHour}:${currentMinutes}`)
  }

  const handleMinuteChange = (newMinute: string) => {
    const currentHours = hours || "00"
    onChange(`${currentHours}:${newMinute}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-background border-input rounded-xl h-10 px-3",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 rounded-2xl" align="start">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground">Hora</label>
            <Select value={hours} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[80px] rounded-xl">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="rounded-xl h-[200px]">
                {Array.from({ length: 24 }).map((_, i) => {
                  const hourStr = i.toString().padStart(2, "0")
                  return (
                    <SelectItem key={hourStr} value={hourStr} className="rounded-lg">
                      {hourStr}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <span className="text-xl font-bold mt-4">:</span>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground">Minuto</label>
            <Select value={minutes} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-[80px] rounded-xl">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="rounded-xl h-[200px]">
                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((minStr) => (
                  <SelectItem key={minStr} value={minStr} className="rounded-lg">
                    {minStr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
