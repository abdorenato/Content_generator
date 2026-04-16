export interface ScriptInput {
  tema: string;
  grandeTema: string;
  publico: string;
}

export interface ScriptBlocks {
  gancho: string;
  identificacao: string;
  conflito: string;
  bordao: string;
  virada: string;
  transicao: string;
  cta: string;
}

export type BlockName = keyof ScriptBlocks;

export const BLOCK_LABELS: Record<BlockName, string> = {
  gancho: "Gancho",
  identificacao: "Identificação",
  conflito: "Conflito",
  bordao: "Bordão",
  virada: "Virada",
  transicao: "Transição",
  cta: "CTA",
};

export const BLOCK_DESCRIPTIONS: Record<BlockName, string> = {
  gancho: "Pergunta de identificação — usa a memória fornecida",
  identificacao: '"Caramba, isso sou eu" — 2-3 frases',
  conflito: "Tensão analógico vs digital — usa o insumo do tema",
  bordao: "Fixo — Calma, criatura.",
  virada: "Conecta direto com o conflito",
  transicao: "O destino — sair da roda do hamster",
  cta: "Chamada pra seguir — uma linha",
};

export const GRANDES_TEMAS = [
  "Transição de Mundo",
  "Autossuficiência Forçada",
  "Promessas que não se cumpriram",
] as const;

export const DEFAULT_PUBLICO =
  "Dono de negócio, 40+, preso no operacional";
