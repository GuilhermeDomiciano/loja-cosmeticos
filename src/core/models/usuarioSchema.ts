import { z } from "zod";
import { zUuid } from "./common";

export const usuarioCreateSchema = z.object({
  organizacaoId: zUuid,
  email: z.string().email("email inválido"),
  nome: z.string().trim().min(1, "nome é obrigatório"),
  senha: z.string().min(6, "senha deve ter ao menos 6 caracteres"),
  papel: z.string().trim().optional(),
});

export const usuarioUpdateSchema = z.object({
  email: z.string().email("email inválido").optional(),
  nome: z.string().trim().min(1, "nome é obrigatório").optional(),
  senha: z.string().min(6, "senha deve ter ao menos 6 caracteres").optional(),
  papel: z.string().trim().optional(),
});

export type UsuarioCreateInput = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdateInput = z.infer<typeof usuarioUpdateSchema>;

