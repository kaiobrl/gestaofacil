import { z } from "zod";

export const createDealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.number().min(0, "Valor deve ser positivo").optional(),
  stage: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedClose: z.string().datetime().optional(),
  contactId: z.string().uuid("ID do contato inválido").optional().or(z.literal("")),
  companyId: z.string().uuid("ID da empresa inválido").optional().or(z.literal("")),
  ownerId: z.string().uuid("ID do responsável inválido").optional().or(z.literal("")),
});

export const updateDealSchema = z.object({
  id: z.string().uuid("ID inválido"),
  title: z.string().min(1).optional(),
  value: z.number().min(0).optional(),
  stage: z.string().optional(),
  status: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedClose: z.string().datetime().optional(),
  contactId: z.string().uuid().optional().or(z.literal("")),
  companyId: z.string().uuid().optional().or(z.literal("")),
  ownerId: z.string().uuid().optional().or(z.literal("")),
  lostReason: z.string().optional(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;
