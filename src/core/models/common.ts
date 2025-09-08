import { z } from "zod";

export const zUuid = z.string().uuid("uuid inválido");

export const zDecimal = z
  .union([
    z.string().trim().min(1, "valor é obrigatório"),
    z.number(),
  ])
  .transform((v) => (typeof v === "number" ? v.toString() : v));

export const unidadeEnum = z.enum(["UN", "ML", "G", "KG", "L"]);
export const tipoMovimentacaoEnum = z.enum(["ENTRADA", "SAIDA"]);
export const motivoMovimentacaoEnum = z.enum([
  "COMPRA",
  "VENDA",
  "AJUSTE",
  "DEVOLUCAO",
  "TRANSFERENCIA",
  "PERDA",
]);
export const canalVendaEnum = z.enum([
  "BALCAO",
  "WHATSAPP",
  "INSTAGRAM",
  "MARKETPLACE",
  "OUTRO",
]);
export const metodoPagamentoEnum = z.enum([
  "DINHEIRO",
  "PIX",
  "CREDITO",
  "DEBITO",
  "BOLETO",
  "TRANSFERENCIA",
  "OUTRO",
]);
export const tipoTransacaoEnum = z.enum(["RECEBER", "PAGAR"]);
export const statusTransacaoEnum = z.enum([
  "PENDENTE",
  "PAGO",
  "RECEBIDO",
  "CANCELADO",
  "VENCIDO",
]);

