import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell, Pie, PieChart, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MoreHorizontal, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const barData = [
  { day: "Seg", entradas: 1200, saidas: 800 },
  { day: "Ter", entradas: 1500, saidas: 1100 },
  { day: "Qua", entradas: 1100, saidas: 1400 },
  { day: "Qui", entradas: 1800, saidas: 950 },
  { day: "Sex", entradas: 2500, saidas: 1200 },
  { day: "Sab", entradas: 3200, saidas: 1800 },
  { day: "Dom", entradas: 800, saidas: 300 },
]

const donutData = [
  { category: "Cortes", value: 4500, fill: "#baf91a" },
  { category: "Barba", value: 2100, fill: "#e2ff99" },
  { category: "Produtos", value: 1800, fill: "#876dff" },
  { category: "Insumos", value: 800, fill: "#f43f5e" },
  { category: "Outros", value: 400, fill: "#94a3b8" },
]

const barConfig = {
  entradas: {
    label: "Entradas",
    color: "#10b981", // Emerald-500
  },
  saidas: {
    label: "Saídas",
    color: "#f43f5e", // Rose-500
  },
} satisfies ChartConfig

const donutConfig = {
  value: {
    label: "Valor",
  },
  Cortes: {
    label: "Cortes",
    color: "#baf91a",
  },
  Barba: {
    label: "Barba",
    color: "#e2ff99",
  },
  Produtos: {
    label: "Produtos",
    color: "#876dff",
  },
  Insumos: {
    label: "Insumos",
    color: "#f43f5e",
  },
  Outros: {
    label: "Outros",
    color: "#94a3b8",
  },
} satisfies ChartConfig

export function FinancialCharts({ isFiltered }: { isFiltered?: boolean }) {
  const currentBarData = isFiltered ? barData.map(d => ({
    ...d,
    entradas: d.entradas * 0.7,
    saidas: d.saidas * 1.2
  })) : barData

  const currentDonutData = isFiltered ? donutData.map(d => ({
    ...d,
    value: d.value * (0.8 + Math.random() * 0.4)
  })) : donutData

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart - Major Highlight */}
      <Card className="lg:col-span-2 bg-card/40 border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl shadow-primary/5">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-7 px-4 sm:px-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">Fluxo de Entradas vs Saídas</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 flex flex-wrap items-center gap-2">
                {isFiltered ? "Período selecionado" : "Diário da semana atual"}
                {!isFiltered && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px]">
                        <TrendingUp className="size-3" /> +12%
                    </div>
                )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl border border-border/50 hidden sm:flex">
            <MoreHorizontal className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-2">
          <ChartContainer config={barConfig} className="h-[250px] sm:h-[350px] w-full">
            <BarChart
              accessibilityLayer
              data={currentBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
                className="text-[10px] font-bold uppercase tracking-widest fill-muted-foreground"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                className="text-[10px] font-bold tabular-nums fill-muted-foreground"
                tickFormatter={(val) => `R$ ${val}`}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="entradas"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={32}
              >
                 <LabelList 
                    dataKey="entradas" 
                    position="top" 
                    offset={10} 
                    className="fill-emerald-600 font-black text-[9px] tabular-nums"
                    formatter={(val: any) => `R$${val}`}
                 />
              </Bar>
              <Bar
                dataKey="saidas"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                barSize={32}
              >
                  <LabelList 
                    dataKey="saidas" 
                    position="top" 
                    offset={10} 
                    className="fill-rose-500 font-black text-[9px] tabular-nums"
                    formatter={(val: any) => `R$${val}`}
                 />
              </Bar>
            </BarChart>
          </ChartContainer>
          
          <div className="mt-6 flex items-center justify-center gap-8 pb-4">
              <div className="flex items-center gap-2">
                  <div className="size-2 rounded-sm bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="size-2 rounded-sm bg-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Saídas</span>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Donut Chart - Distribution */}
      <Card className="bg-card/40 border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl shadow-primary/5 h-full">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-xl font-black tracking-tight text-center">Distribuição</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 text-center">
            Quebra de receitas por categoria
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={donutConfig}
            className="mx-auto aspect-square h-[280px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={currentDonutData}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={5}
                className="stroke-background"
              >
                 {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          
          <div className="mt-4 space-y-3 pb-8 px-4">
              {donutData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.category}</span>
                      </div>
                      <span className="text-xs font-black tabular-nums text-foreground">
                        {((item.value / currentDonutData.reduce((acc, d) => acc + d.value, 0)) * 100).toFixed(1)}%
                      </span>
                  </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
