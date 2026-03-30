import { useState, useMemo } from "react"
import { Search, Check, Scissors, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Service } from "../types"
import { Badge } from "@/components/ui/badge"

interface ServicePickerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  onConfirm: (selectedServices: Service[]) => void
  alreadySelectedIds?: string[]
}

export function ServicePickerModal({
  isOpen,
  onOpenChange,
  services,
  onConfirm,
  alreadySelectedIds = [],
}: ServicePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>(alreadySelectedIds)

  // Atualizar seleção quando o modal abrir
  useMemo(() => {
    if (isOpen) {
      setSelectedIds(alreadySelectedIds)
      setSearchTerm("")
    }
  }, [isOpen, alreadySelectedIds])

  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [services, searchTerm])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    const selected = services.filter((s) => selectedIds.includes(s.id))
    onConfirm(selected)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Scissors className="size-5 text-primary" />
            Selecionar Serviços
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-left">
            Escolha um ou mais serviços para adicionar ao atendimento.
          </p>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviço pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto px-6 py-2 space-y-2">
          {filteredServices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhum serviço encontrado.</p>
            </div>
          ) : (
            filteredServices.map((svc) => {
              const isSelected = selectedIds.includes(svc.id)
              return (
                <div
                  key={svc.id}
                  onClick={() => handleToggle(svc.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-background/40 border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    id={`svc-${svc.id}`}
                    checked={isSelected}
                    className="size-5 rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">{svc.duration} min</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                      R$ {Number(svc.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <DialogFooter className="p-6 pt-2 bg-muted/30 flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            {selectedIds.length} {selectedIds.length === 1 ? "selecionado" : "selecionados"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90"
              disabled={selectedIds.length === 0}
            >
              <Check className="size-4 mr-2" />
              Confirmar Seleção
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
