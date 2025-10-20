import { z } from "zod";
import { zUuid } from "./common";

export const marcaCreateSchema = z.object({
  organizacaoId: zUuid,
  nome: z.string().trim().min(1, "nome é obrigatório"),
});

export const marcaUpdateSchema = z.object({
  nome: z.string().trim().min(1, "nome é obrigatório").optional(),
});

export type MarcaCreateInput = z.infer<typeof marcaCreateSchema>;
export type MarcaUpdateInput = z.infer<typeof marcaUpdateSchema>;

