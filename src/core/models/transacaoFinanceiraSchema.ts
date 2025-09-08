import { z } from "zod";
import { metodoPagamentoEnum, statusTransacaoEnum, tipoTransacaoEnum, zDecimal, zUuid } from "./common";

export const transacaoFinanceiraCreateSchema = z.object({
  organizacaoId: zUuid,
  tipo: tipoTransacaoEnum,
  status: statusTransacaoEnum.optional(),
  metodo: metodoPagamentoEnum.optional(),
  valor: zDecimal,
  dataVencimento: z.string().datetime().optional(),
  pagoEm: z.string().datetime().optional(),
  descricao: z.string().optional(),
  movimentacaoId: zUuid.optional().nullable(),
});

export const transacaoFinanceiraUpdateSchema = z.object({
  tipo: tipoTransacaoEnum.optional(),
  status: statusTransacaoEnum.optional(),
  metodo: metodoPagamentoEnum.optional().nullable(),
  valor: zDecimal.optional(),
  dataVencimento: z.string().datetime().optional().nullable(),
  pagoEm: z.string().datetime().optional().nullable(),
  descricao: z.string().optional().nullable(),
  movimentacaoId: zUuid.optional().nullable(),
});

export type TransacaoFinanceiraCreateInput = z.infer<typeof transacaoFinanceiraCreateSchema>;
export type TransacaoFinanceiraUpdateInput = z.infer<typeof transacaoFinanceiraUpdateSchema>;

