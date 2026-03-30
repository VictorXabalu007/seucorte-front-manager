import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BarberCommissionStats } from "../types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useRef } from "react"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/navigation"

interface BarberPerformanceCardProps {
  stats: BarberCommissionStats
  onViewDetails: (barberId: string) => void
  onLiquidate: (barberId: string) => void
}

const BarberPerformanceCard = ({ stats, onViewDetails, onLiquidate }: BarberPerformanceCardProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const isLiquidated = stats.pendingCommission <= 0

  return (
    <div className="bg-card/40 rounded-xl p-5 flex flex-col border border-border/50 hover:translate-y-[-4px] transition-transform duration-300 h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <Avatar className="w-14 h-14 rounded-xl border-border">
            <AvatarImage src={stats.avatar} className="object-cover" />
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-black text-xl">
              {stats.barberName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black px-1.5 py-0.5 rounded-md">
            PRO
          </span>
        </div>
        <div className="text-right">
          <span className="block text-xs text-muted-foreground">Comissões Mês</span>
          <span className="text-lg font-bold text-foreground">{formatCurrency(stats.totalCommission)}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-foreground truncate">{stats.barberName}</h4>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="size-3 text-amber-500 fill-amber-500" />
          <span className="text-xs text-foreground font-medium">4.9</span>
          <span className="text-[10px] text-muted-foreground ml-2">{stats.totalServices + stats.totalProducts} itens mês</span>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Pendente:</span>
          {isLiquidated ? (
            <span className="text-primary font-bold">Liquidado</span>
          ) : (
            <span className="text-destructive font-bold">{formatCurrency(stats.pendingCommission)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            className="flex-1 py-2 rounded-lg bg-muted border border-border/50 text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
            onClick={() => onViewDetails(stats.barberId)}
          >
            Detalhes
          </button>
          <button 
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isLiquidated}
            onClick={() => onLiquidate(stats.barberId)}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  )
}

interface BarberPerformanceProps {
  stats: BarberCommissionStats[]
  onViewDetails: (barberId: string) => void
  onLiquidate: (barberId: string) => void
}

export function BarberPerformance({ stats, onViewDetails, onLiquidate }: BarberPerformanceProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Performance da Equipe
        </h2>
        <div className="flex gap-2">
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-card border border-border/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-card border border-border/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="w-full !pb-4"
      >
        {stats.map((barber) => (
          <SwiperSlide key={barber.barberId} className="h-auto">
            <BarberPerformanceCard 
              stats={barber} 
              onViewDetails={onViewDetails}
              onLiquidate={onLiquidate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
