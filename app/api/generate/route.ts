import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildGeneratePrompt } from "@/lib/prompts";
import { ScriptBlocks } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { tema, grandeTema, publico } = await request.json();

    if (!tema || !grandeTema || !publico) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildGeneratePrompt(tema, grandeTema, publico),
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

    const parsed: ScriptBlocks = JSON.parse(textBlock.text);
    // Always enforce the fixed bordão
    parsed.bordao = "Calma, criatura.";

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao gerar roteiro.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
