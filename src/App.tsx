import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useLoading } from "./components/loading-provider"
import InventoryPage from "./pages/estoque/InventoryPage"
import AgendaPage from "./pages/agenda/AgendaPage"
import AgendaCalendarPage from "./pages/agenda/AgendaCalendarPage"
import ClientesPage from "./pages/clientes/ClientesPage"
import FinanceiroPage from "./pages/financeiro/FinanceiroPage"
import ComissaoPage from "./pages/comissao/ComissaoPage"
import MetasPage from "./pages/metas/MetasPage"
import UnidadesPage from "./pages/unidades/UnidadesPage"
import ServicesPage from "./pages/servicos/ServicesPage"
import PlanosPage from "./pages/planos/PlanosPage"
import BarbersPage from "./pages/barbeiros/BarbersPage"
import { AdminLayout } from "./components/layout/AdminLayout"

// Placeholder components for other pages
const DashboardPage = () => {
  const { setIsLoading } = useLoading()
  useEffect(() => { setIsLoading(false) }, [setIsLoading])
  return <AdminLayout><div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500">Em breve...</p></div></AdminLayout>
}
const ReportsPage = () => {
  const { setIsLoading } = useLoading()
  useEffect(() => { setIsLoading(false) }, [setIsLoading])
  return <AdminLayout><div className="p-8"><h1 className="text-2xl font-bold">Relatórios</h1><p className="text-slate-500">Em breve...</p></div></AdminLayout>
}
const SettingsPage = () => {
  const { setIsLoading } = useLoading()
  useEffect(() => { setIsLoading(false) }, [setIsLoading])
  return <AdminLayout><div className="p-8"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-slate-500">Em breve...</p></div></AdminLayout>
}

import { ThemeProvider } from "./components/theme-provider"
import { LoadingProvider } from "./components/loading-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="barberflow-ui-theme">
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/estoque" replace />} />
            <Route path="/estoque" element={<InventoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/agenda-calendario" element={<AgendaCalendarPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/barbeiros" element={<BarbersPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/comissao" element={<ComissaoPage />} />
            <Route path="/metas" element={<MetasPage />} />
            <Route path="/unidades" element={<UnidadesPage />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
