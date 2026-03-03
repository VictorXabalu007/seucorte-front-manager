import type { Barber } from "../types"

export const MOCK_BARBERS: Barber[] = [
  {
    id: "b1",
    name: "João Silva",
    email: "joao.silva@barberflow.com",
    phone: "(11) 98765-4321",
    specialty: "Corte Moderno & Barba",
    bio: "Especialista em degrade e visagismo facial.",
    color: "#baf91a",
    commissionType: "PERCENTAGE",
    commissionValue: 30,
    cutPrice: 50,
    isActive: true,
    serviceIds: ["s1", "s2", "s3", "s5"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    name: "Ricardo Alves",
    email: "ricardo.alves@barberflow.com",
    phone: "(11) 91234-5678",
    specialty: "Clássico & Navalha",
    bio: "Mais de 10 anos de experiência com barbearia tradicional.",
    color: "#876dff",
    commissionType: "FIXED",
    commissionValue: 15,
    cutPrice: 60,
    isActive: true,
    serviceIds: ["s1", "s3", "s4", "s5"],
    createdAt: new Date().toISOString(),
  },
]
