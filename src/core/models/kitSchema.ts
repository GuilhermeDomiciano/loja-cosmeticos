import { z } from "zod";
import { zDecimal, zUuid } from "./common";

export const kitCreateSchema = z.object({
  organizacaoId: zUuid,
  nome: z.string().trim().min(1, "nome é obrigatório"),
  sku: z.string().optional(),
  preco: zDecimal,
  ativo: z.boolean().optional(),
  imagemUrl: z.string().url().optional(),
});

export const kitUpdateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório").optional(),
  sku: z.string().optional().nullable(),
  preco: zDecimal.optional(),
  ativo: z.boolean().optional(),
  imagemUrl: z.string().url().optional().nullable(),
});

export type KitCreateInput = z.infer<typeof kitCreateSchema>;
export type KitUpdateInput = z.infer<typeof kitUpdateSchema>;

