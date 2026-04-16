import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildRegeneratePrompt } from "@/lib/prompts";
import { BlockName, ScriptBlocks } from "@/lib/types";

const anthropic = new Anthropic();

const VALID_BLOCKS: BlockName[] = [
  "gancho",
  "identificacao",
  "conflito",
  "bordao",
  "virada",
  "transicao",
  "cta",
];

export async function POST(request: NextRequest) {
  try {
    const { blockName, currentScript, tema, grandeTema, publico } =
      await request.json();

    if (!VALID_BLOCKS.includes(blockName)) {
      return NextResponse.json(
        { error: "Bloco inválido." },
        { status: 400 }
      );
    }

    // Bordão never changes
    if (blockName === "bordao") {
      return NextResponse.json({ bordao: "Calma, criatura." });
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildRegeneratePrompt(
            blockName as BlockName,
            currentScript as ScriptBlocks,
            tema,
            grandeTema,
            publico
          ),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Resposta inesperada da API." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(textBlock.text);

    // Enforce bordão even if API somehow returns it
    if ("bordao" in parsed) {
      parsed.bordao = "Calma, criatura.";
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Regenerate error:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao regenerar bloco.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
