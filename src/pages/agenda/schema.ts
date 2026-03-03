import { z } from "zod"

export const appointmentFormSchema = z.object({
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientPhone: z.string().optional(),
  professionalId: z.string().min(1, "Selecione um barbeiro"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  dateObj: z.date({ required_error: "Selecione uma data" }),
  startTime: z.string().min(1, "Selecione o horário de início"),
  endTime: z.string().min(1, "Selecione o horário de término"),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED"]),
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  amount: z.number().min(0),
  notes: z.string().optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
