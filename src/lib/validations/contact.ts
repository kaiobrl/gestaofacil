import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().optional(),
  companyId: z.string().uuid("ID da empresa inválido").optional().or(z.literal("")).transform(v => v || undefined),
  jobTitle: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")).transform(v => v || undefined),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export const updateContactSchema = z.object({
  id: z.string().uuid("ID inválido"),
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().optional(),
  companyId: z.string().uuid("ID da empresa inválido").optional().or(z.literal("")).transform(v => v || undefined),
  jobTitle: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")).transform(v => v || undefined),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
