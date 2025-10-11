/**
 * Constantes da aplicação
 */

export const APP_NAME = "Loja de Cosméticos";
export const APP_DESCRIPTION = "Sistema de gestão completo";

// Enums do Prisma mapeados para display
export const UNIDADES = {
  UN: "Unidade",
  ML: "Mililitro",
  G: "Grama",
  KG: "Quilograma",
  L: "Litro",
} as const;

export const TIPO_MOVIMENTACAO = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
} as const;

export const MOTIVO_MOVIMENTACAO = {
  COMPRA: "Compra",
  VENDA: "Venda",
  AJUSTE: "Ajuste",
  DEVOLUCAO: "Devolução",
  TRANSFERENCIA: "Transferência",
  PERDA: "Perda",
} as const;

export const CANAL_VENDA = {
  BALCAO: "Balcão",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  MARKETPLACE: "Marketplace",
  OUTRO: "Outro",
} as const;

export const METODO_PAGAMENTO = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CREDITO: "Crédito",
  DEBITO: "Débito",
  BOLETO: "Boleto",
  TRANSFERENCIA: "Transferência",
  OUTRO: "Outro",
} as const;

export const TIPO_TRANSACAO = {
  RECEBER: "A Receber",
  PAGAR: "A Pagar",
} as const;

export const STATUS_TRANSACAO = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  RECEBIDO: "Recebido",
  CANCELADO: "Cancelado",
  VENCIDO: "Vencido",
} as const;

// Configurações de paginação
export const ITEMS_PER_PAGE = 20;
export const ITEMS_PER_PAGE_MOBILE = 10;

// Configurações de upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Breakpoints Tailwind (para uso em JS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
