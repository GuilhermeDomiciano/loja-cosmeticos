import { z } from "zod";
import { zUuid } from "./common";

export const arquivoCreateSchema = z.object({
  organizacaoId: zUuid,
  caminho: z.string().trim().min(1, "caminho é obrigatório"),
  url: z.string().url().optional(),
  entidade: z.string().trim().min(1, "entidade é obrigatória"),
  entidadeId: z.string().trim().min(1, "entidadeId é obrigatório"),
});

export const arquivoUpdateSchema = z.object({
  caminho: z.string().trim().min(1, "caminho é obrigatório").optional(),
  url: z.string().url().optional().nullable(),
});

export type ArquivoCreateInput = z.infer<typeof arquivoCreateSchema>;
export type ArquivoUpdateInput = z.infer<typeof arquivoUpdateSchema>;

