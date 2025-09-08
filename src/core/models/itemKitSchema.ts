import { z } from "zod";
import { zDecimal, zUuid } from "./common";

export const itemKitCreateSchema = z.object({
  organizacaoId: zUuid,
  kitId: zUuid,
  variacaoId: zUuid,
  quantidade: zDecimal,
});

export const itemKitUpdateSchema = z.object({
  quantidade: zDecimal,
});

export type ItemKitCreateInput = z.infer<typeof itemKitCreateSchema>;
export type ItemKitUpdateInput = z.infer<typeof itemKitUpdateSchema>;

