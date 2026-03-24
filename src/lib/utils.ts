import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: string | number, isMask = false) {
  if (value === undefined || value === null) return "R$ 0,00"

  let numericValue: number

  if (typeof value === "number") {
    numericValue = value
  } else {
    if (isMask) {
      // Se for uma máscara de input (apenas dígitos), tratamos como centavos
      const digits = value.toString().replace(/\D/g, "")
      numericValue = parseInt(digits || "0") / 100
    } else {
      // Se for dado da API/Banco, tentamos converter diretamente
      if (typeof value === "string") {
        // Se a string já tiver separadores decimais, usamos parseFloat
        if (value.includes(".") || value.includes(",")) {
          numericValue = parseFloat(value.replace(",", "."))
        } else {
          // Se for uma string de dígitos pura como "100", tratamos como valor inteiro (100,00)
          // a menos que desejemos especificamente centavos. No SeuCorte tratamos como real.
          numericValue = parseFloat(value) || 0
        }
      } else {
        numericValue = 0
      }
    }
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue)
}

export function parseCurrencyToNumber(value: string): number {
  return parseInt(value.replace(/\D/g, "")) / 100
}
