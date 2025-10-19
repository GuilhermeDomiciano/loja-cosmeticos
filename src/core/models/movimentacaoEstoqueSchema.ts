import { z } from "zod";
import { canalVendaEnum, motivoMovimentacaoEnum, tipoMovimentacaoEnum, zDecimal, zUuid } from "./common";

export const movimentacaoEstoqueCreateSchema = z.object({
  organizacaoId: zUuid.optional(),
  variacaoId: zUuid,
  loteId: zUuid.optional().nullable(),
  vendedorId: zUuid.optional().nullable(),
  tipo: tipoMovimentacaoEnum,
  motivo: motivoMovimentacaoEnum,
  quantidade: zDecimal,
  precoUnitario: zDecimal.optional(),
  total: zDecimal.optional(),
  canal: canalVendaEnum.optional(),
  observacoes: z.string().optional(),
});

export const movimentacaoEstoqueUpdateSchema = z.object({
  loteId: zUuid.optional().nullable(),
  vendedorId: zUuid.optional().nullable(),
  tipo: tipoMovimentacaoEnum.optional(),
  motivo: motivoMovimentacaoEnum.optional(),
  quantidade: zDecimal.optional(),
  precoUnitario: zDecimal.optional().nullable(),
  total: zDecimal.optional().nullable(),
  canal: canalVendaEnum.optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export type MovimentacaoEstoqueCreateInput = z.infer<typeof movimentacaoEstoqueCreateSchema>;
export type MovimentacaoEstoqueUpdateInput = z.infer<typeof movimentacaoEstoqueUpdateSchema>;
