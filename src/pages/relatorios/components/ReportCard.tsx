import { TrendingUp, TrendingDown, Info } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { ReportSummary, ChartDataPoint } from "../types"

interface ReportCardProps {
  title: string
  description?: string
  children: React.ReactNode
  summaries?: ReportSummary[]
}

export function ReportCard({ title, description, children, summaries }: ReportCardProps) {
  return (
    <div className="bg-card/40 border border-border/50 rounded-[2.5rem] p-8 backdrop-blur-sm overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground font-medium text-xs mt-1">{description}</p>}
        </div>
        <div className="p-2 bg-muted/50 rounded-xl">
           <Info className="size-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 min-h-[350px]">
          {children}
        </div>
        
        <div className="space-y-6">
          {summaries?.map((s) => (
            <div key={s.title} className="p-4 bg-background/40 border border-border/40 rounded-3xl relative overflow-hidden group">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest relative z-10">{s.title}</p>
              <div className="flex items-baseline gap-2 mt-1 relative z-10">
                <p className="text-xl font-black tabular-nums tracking-tighter">
                  {s.prefix}{s.value}{s.suffix}
                </p>
                <div className={cn(
                  "flex items-center gap-0.5 text-[10px] font-black tracking-tighter",
                  s.isPositive ? "text-emerald-500" : "text-rose-500"
                )}>
                  {s.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {s.change}%
                </div>
              </div>
              {/* Micro-sparkline decoration (simulated) */}
              <div className={cn(
                "absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.03] rotate-12 transition-transform group-hover:scale-125 duration-700",
                s.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                <TrendingUp size={64} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReportAreaChart({ data, config, dataKey = "value" }: { data: ChartDataPoint[], config: ChartConfig, dataKey?: string }) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke="hsl(var(--primary))" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorValue)" 
          animationDuration={1500}
        />
      </AreaChart>
    </ChartContainer>
  )
}
