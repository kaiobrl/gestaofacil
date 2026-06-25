import { z } from "zod";

export const createActivitySchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "NOTE"], {
    message: "Tipo de atividade inválido",
  }),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  contactId: z.string().uuid("ID do contato inválido").optional().or(z.literal("")),
  dealId: z.string().uuid("ID do negócio inválido").optional().or(z.literal("")),
});

export const updateActivitySchema = z.object({
  id: z.string().uuid("ID inválido"),
  completed: z.boolean().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
