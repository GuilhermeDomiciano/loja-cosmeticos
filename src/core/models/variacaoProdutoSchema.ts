import { z } from "zod";
import { zDecimal, zUuid, unidadeEnum } from "./common";

export const variacaoProdutoCreateSchema = z.object({
  organizacaoId: zUuid,
  produtoId: zUuid,
  nome: z.string().trim().optional(),
  sku: z.string().optional(),
  unidade: unidadeEnum.optional(),
  codigoBarras: z.string().optional(),
  preco: zDecimal,
  custo: zDecimal.optional(),
  estoqueMinimo: zDecimal.optional(),
});

export const variacaoProdutoUpdateSchema = z.object({
  nome: z.string().trim().optional().nullable(),
  sku: z.string().optional().nullable(),
  unidade: unidadeEnum.optional(),
  codigoBarras: z.string().optional().nullable(),
  preco: zDecimal.optional(),
  custo: zDecimal.optional().nullable(),
  estoqueMinimo: zDecimal.optional().nullable(),
});

export type VariacaoProdutoCreateInput = z.infer<typeof variacaoProdutoCreateSchema>;
export type VariacaoProdutoUpdateInput = z.infer<typeof variacaoProdutoUpdateSchema>;

