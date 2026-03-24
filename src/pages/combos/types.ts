import type { Service } from "../../servicos/types"

export interface ComboFormData {
  name: string
  description?: string
  duration: string
  price: number
  isActive: boolean
  serviceIds: string[]
}

export interface ComboCardProps {
  combo: Service
  servicesList: Service[]
  onEdit: (combo: Service) => void
  onDelete: (id: string) => void
}

export interface ComboSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  combo: Service | null
  servicesList: Service[]
  onSave: (data: ComboFormData) => void
}
