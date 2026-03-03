import { useEffect } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"

export default function MetasPage() {
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter dark:text-white">Metas</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Acompanhamento de metas e desempenho.</p>
        </div>
        <div className="h-96 border-2 border-dashed border-border rounded-3xl flex items-center justify-center text-slate-500 font-bold">
          Módulo de Metas em breve...
        </div>
      </div>
    </AdminLayout>
  )
}
