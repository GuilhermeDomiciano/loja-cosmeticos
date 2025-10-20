import { z } from "zod";
import { zUuid } from "./common";

export const produtoCreateSchema = z.object({
  organizacaoId: zUuid,
  nome: z.string().trim().min(1, "nome é obrigatório"),
  categoriaId: zUuid.optional().nullable(),
  marcaId: zUuid.optional().nullable(),
  descricao: z.string().optional(),
  sku: z.string().optional(),
  ativo: z.boolean().optional(),
  imagemUrl: z.string().url().optional(),
});

export const produtoUpdateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório").optional(),
  categoriaId: zUuid.optional().nullable(),
  marcaId: zUuid.optional().nullable(),
  descricao: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  ativo: z.boolean().optional(),
  imagemUrl: z.string().url().optional().nullable(),
});

export type ProdutoCreateInput = z.infer<typeof produtoCreateSchema>;
export type ProdutoUpdateInput = z.infer<typeof produtoUpdateSchema>;

