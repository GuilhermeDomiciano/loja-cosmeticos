import { z } from "zod";

export const categoriaCreateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório"),
  organizacaoId: z.string().uuid("organizacaoId inválido"),
});

export const categoriaUpdateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório"),
});

export type CategoriaCreateInput = z.infer<typeof categoriaCreateSchema>;
export type CategoriaUpdateInput = z.infer<typeof categoriaUpdateSchema>;

