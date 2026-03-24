import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/login/LoginPage"
import RegisterPage from "./pages/login/RegisterPage"
import OtpVerificationPage from "./pages/login/OtpVerificationPage"
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage"
import ResetPasswordPage from "./pages/login/ResetPasswordPage"
import { useLoading } from "./components/loading-provider"
import InventoryPage from "./pages/estoque/InventoryPage"
import AgendaPage from "./pages/agenda/AgendaPage"
import AgendaCalendarPage from "./pages/agenda/AgendaCalendarPage"
import ClientesPage from "./pages/clientes/ClientesPage"
import ClienteProfilePage from "./pages/clientes/ClienteProfilePage"
import FinanceiroPage from "./pages/financeiro/FinanceiroPage"
import ComissaoPage from "./pages/comissao/ComissaoPage"
import MetasPage from "./pages/metas/MetasPage"
import UnidadesPage from "./pages/unidades/UnidadesPage"
import ServicesPage from "./pages/servicos/ServicesPage"
import CombosPage from "./pages/combos/CombosPage"
import PlanosPage from "./pages/planos/PlanosPage"
import BarbersPage from "./pages/barbeiros/BarbersPage"
import BarberFormPage from "./pages/barbeiros/BarberFormPage"
import FirstAccessPage from "./pages/login/FirstAccessPage"
import { AdminLayout } from "./components/layout/AdminLayout"

// Placeholder components for other pages
const DashboardPage = () => {
  const { setIsLoading } = useLoading()
  useEffect(() => { setIsLoading(false) }, [setIsLoading])
  return <AdminLayout><div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500">Em breve...</p></div></AdminLayout>
}
const SettingsPage = () => {
  const { setIsLoading } = useLoading()
  useEffect(() => { setIsLoading(false) }, [setIsLoading])
  return <AdminLayout><div className="p-8"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-slate-500">Em breve...</p></div></AdminLayout>
}
import ReportsPage from "./pages/relatorios/ReportsPage"
import { Toaster } from "sonner"
import { ThemeProvider } from "./components/theme-provider"
import { LoadingProvider } from "./components/loading-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="barberflow-ui-theme">
      <Toaster position="top-right" expand={false} richColors closeButton />
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/primeiro-acesso" element={<FirstAccessPage />} />

            <Route path="/estoque" element={<InventoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/agenda-calendario" element={<AgendaCalendarPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/:id/perfil" element={<ClienteProfilePage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/combos" element={<CombosPage />} />
            <Route path="/barbeiros" element={<BarbersPage />} />
            <Route path="/barbeiros/novo" element={<BarberFormPage />} />
            <Route path="/barbeiros/:id/editar" element={<BarberFormPage />} />
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
