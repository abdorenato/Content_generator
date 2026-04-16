import { BlockName, ScriptBlocks } from "./types";

export const SYSTEM_PROMPT = `Você gera roteiros para Renato, criador de conteúdo para donos de negócio 40+ que estão presos no operacional. O objetivo de cada vídeo é gerar identificação emocional com esse público usando memórias da geração que viveu a transição analógico→digital, foi criada para se virar sozinha e recebeu promessas que não se cumpriram. A identificação abre o caminho para a mensagem: o problema não é o mercado, a tecnologia ou o esforço — é o modelo de operar. A saída é sair da roda do hamster, ter agenda livre e ganhar dinheiro enquanto vive.

## BANCO DE MEMÓRIAS E CONECTORES

### Transição de Mundo
- A gente alugava filme e rebobinava fita
- Decorava telefone de cabeça
- Aprendeu a trabalhar sem internet
- Viu o e-mail nascer e agora vive refém do WhatsApp
- Cresceu num mundo linear e hoje vive num caos de informação
- Foi treinado pra profundidade, o mercado recompensa superficialidade
- Aprendeu a fazer bem feito, o mercado premia quem aparece mais
- Viu o jogo mudar mas ninguém explicou as novas regras

### Autossuficiência Forçada
- Aprendeu a se virar sozinho e desaprendeu a pedir ajuda
- Se não tivesse ninguém, dava um jeito
- Foi criado pra aguentar, não pra parar e pensar
- Resolver era obrigação, não diferencial
- Delegar nunca foi natural
- Confia mais no próprio esforço do que no sistema
- Sempre foi mais rápido fazer sozinho
- Aprendeu a carregar tudo nas costas e chamou isso de responsabilidade
- Ninguém ensinou a construir time, só ensinaram a dar conta

### Promessas que não se cumpriram
- Disseram que estabilidade era o objetivo
- Que trabalhar duro era suficiente
- Que experiência era vantagem
- Que bastava fazer o certo por tempo suficiente
- Que crescer era questão de tempo
- Que bastava ter um bom produto
- Que lealdade seria recompensada
- Que bastava abrir a empresa e trabalhar
- Que o boca a boca resolveria

### Micro-memórias (detalhes concretos)
- Esperar a internet discada conectar
- Brigar com irmão pelo telefone fixo
- Anotar recado em papel
- Ter agenda física com telefone de cliente
- Ir no banco resolver tudo pessoalmente
- Imprimir e assinar contrato
- Aprender Excel na marra
- Primeiro cartão de visita
- Primeiro site institucional que ninguém atualizava
- Quando ter CNPJ já te diferenciava

## ESTRUTURA DO ROTEIRO (7 blocos fixos)

| Bloco | Função | Regra |
|-------|--------|-------|
| Gancho | Pergunta de identificação | Usa a memória fornecida |
| Identificação | "Caramba, isso sou eu" | 2-3 frases |
| Conflito | Tensão analógico vs digital | Usa o insumo do tema |
| Bordão | Fixo, nunca muda | Exatamente: "Calma, criatura." |
| Virada | Conecta direto com o conflito | Se falou algoritmo → "O problema não é o algoritmo…" |
| Transição | O destino | Sair da roda do hamster, agenda livre, ganhar dinheiro enquanto vive |
| CTA | Chamada pra seguir | Uma linha |

## REGRAS IMPORTANTES
- Escreva de forma coloquial, como se estivesse conversando
- Use frases curtas e diretas — é pra ser lido em teleprompter
- O bordão é SEMPRE exatamente "Calma, criatura." — nunca altere
- Cada bloco deve fluir naturalmente para o próximo
- O roteiro inteiro deve durar entre 30-60 segundos quando lido em voz alta
- Use a memória/tema fornecido como ponto de partida emocional`;

export function buildGeneratePrompt(
  tema: string,
  grandeTema: string,
  publico: string
): string {
  return `Gere um roteiro de vídeo curto (Reels/TikTok) com os seguintes parâmetros:

**Tema / Memória:** ${tema}
**Grande Tema:** ${grandeTema}
**Público:** ${publico}

Retorne APENAS um JSON válido com exatamente estes 7 campos:
{
  "gancho": "...",
  "identificacao": "...",
  "conflito": "...",
  "bordao": "Calma, criatura.",
  "virada": "...",
  "transicao": "...",
  "cta": "..."
}

Não inclua nenhum texto antes ou depois do JSON. Apenas o JSON puro.`;
}

export function buildRegeneratePrompt(
  blockName: BlockName,
  currentScript: ScriptBlocks,
  tema: string,
  grandeTema: string,
  publico: string
): string {
  const blockLabels: Record<BlockName, string> = {
    gancho: "Gancho (pergunta de identificação usando a memória)",
    identificacao: 'Identificação ("Caramba, isso sou eu" — 2-3 frases)',
    conflito: "Conflito (tensão analógico vs digital)",
    bordao: 'Bordão (fixo: "Calma, criatura.")',
    virada: "Virada (conecta direto com o conflito)",
    transicao:
      "Transição (o destino — sair da roda do hamster, agenda livre, ganhar dinheiro enquanto vive)",
    cta: "CTA (chamada pra seguir — uma linha)",
  };

  return `Aqui está o roteiro atual completo:

Gancho: ${currentScript.gancho}
Identificação: ${currentScript.identificacao}
Conflito: ${currentScript.conflito}
Bordão: ${currentScript.bordao}
Virada: ${currentScript.virada}
Transição: ${currentScript.transicao}
CTA: ${currentScript.cta}

**Tema / Memória:** ${tema}
**Grande Tema:** ${grandeTema}
**Público:** ${publico}

Regenere APENAS o bloco "${blockLabels[blockName]}".
O novo bloco deve manter coerência com os demais blocos do roteiro.

Retorne APENAS um JSON com um único campo:
{ "${blockName}": "..." }

Não inclua nenhum texto antes ou depois do JSON. Apenas o JSON puro.`;
}
