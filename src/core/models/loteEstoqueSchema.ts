import { z } from "zod";
import { zDecimal, zUuid } from "./common";

export const loteEstoqueCreateSchema = z.object({
  organizacaoId: zUuid,
  variacaoId: zUuid,
  codigo: z.string().optional(),
  quantidade: zDecimal,
  venceEm: z.string().datetime().optional(),
});

export const loteEstoqueUpdateSchema = z.object({
  codigo: z.string().optional().nullable(),
  quantidade: zDecimal.optional(),
  venceEm: z.string().datetime().optional().nullable(),
});

export type LoteEstoqueCreateInput = z.infer<typeof loteEstoqueCreateSchema>;
export type LoteEstoqueUpdateInput = z.infer<typeof loteEstoqueUpdateSchema>;

