import type { Service } from "../types"

export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Corte de Cabelo",
    description: "Corte moderno com acabamento em navalha.",
    duration: 45,
    price: 50.00,
    category: "Cabelo",
    isActive: true,
    barberIds: ["b1", "b2"]
  },
  {
    id: "s2",
    name: "Barba Completa",
    description: "Aparagem e contorno com toalha quente.",
    duration: 30,
    price: 35.00,
    category: "Barba",
    isActive: true,
    barberIds: ["b1"]
  },
  {
    id: "s3",
    name: "Combo: Cabelo + Barba",
    description: "O serviço completo para o seu visual.",
    duration: 75,
    price: 75.00,
    category: "Combo",
    isActive: true,
    barberIds: ["b1", "b2"]
  },
  {
    id: "s4",
    name: "Hidratação Capilar",
    description: "Tratamento intensivo para cabelos secos.",
    duration: 20,
    price: 25.00,
    category: "Tratamento",
    isActive: true,
    barberIds: ["b2"]
  },
  {
    id: "s5",
    name: "Sobrancelha na Navalha",
    description: "Limpeza e design de sobrancelhas.",
    duration: 15,
    price: 15.00,
    category: "Outros",
    isActive: true,
    barberIds: ["b1", "b2"]
  }
]
