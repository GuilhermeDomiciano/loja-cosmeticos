import { z } from "zod";

export const organizacaoCreateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório"),
});

export const organizacaoUpdateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório"),
});

export type OrganizacaoCreateInput = z.infer<typeof organizacaoCreateSchema>;
export type OrganizacaoUpdateInput = z.infer<typeof organizacaoUpdateSchema>;

