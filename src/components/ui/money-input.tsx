import * as React from "react"
import { Input } from "./input"
import { formatBRL } from "@/lib/utils"

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string | number
  onChange: (value: number) => void
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatBRL(value, false))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "")
      const numberValue = parseInt(rawValue || "0") / 100
      
      // Notify parent of the numeric value
      onChange(numberValue)
      
      // Update local display value
      setDisplayValue(formatBRL(rawValue, true))
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={className}
      />
    )
  }
)

MoneyInput.displayName = "MoneyInput"

export { MoneyInput }
