import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  industry: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")).transform(v => v || undefined),
  email: z.string().email("Email inválido").optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export const updateCompanySchema = z.object({
  id: z.string().uuid("ID inválido"),
  name: z.string().min(1).optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")).transform(v => v || undefined),
  email: z.string().email("Email inválido").optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
