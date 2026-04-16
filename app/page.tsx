"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ScriptBlock from "@/components/ScriptBlock";
import {
  ScriptBlocks,
  BlockName,
  BLOCK_LABELS,
  DEFAULT_PUBLICO,
  GRANDES_TEMAS,
} from "@/lib/types";

const BLOCK_ORDER: BlockName[] = [
  "gancho",
  "identificacao",
  "conflito",
  "bordao",
  "virada",
  "transicao",
  "cta",
];

const EMPTY_SCRIPT: ScriptBlocks = {
  gancho: "",
  identificacao: "",
  conflito: "",
  bordao: "Calma, criatura.",
  virada: "",
  transicao: "",
  cta: "",
};

export default function Home() {
  const [tema, setTema] = useState("");
  const [grandeTema, setGrandeTema] = useState<string>(GRANDES_TEMAS[0]);
  const [publico, setPublico] = useState(DEFAULT_PUBLICO);
  const [script, setScript] = useState<ScriptBlocks | null>(null);
  const [loading, setLoading] = useState(false);
  const [regeneratingBlock, setRegeneratingBlock] = useState<BlockName | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema,
          grandeTema,
          publico: publico || DEFAULT_PUBLICO,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Enforce bordão
      data.bordao = "Calma, criatura.";
      setScript(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar roteiro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(blockName: BlockName) {
    if (!script) return;
    setRegeneratingBlock(blockName);
    setError(null);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockName,
          currentScript: script,
          tema,
          grandeTema,
          publico: publico || DEFAULT_PUBLICO,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScript((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...data };
        // Always enforce bordão
        updated.bordao = "Calma, criatura.";
        return updated;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao regenerar bloco."
      );
    } finally {
      setRegeneratingBlock(null);
    }
  }

  function handleBlockChange(blockName: BlockName, value: string) {
    if (blockName === "bordao") return;
    setScript((prev) => (prev ? { ...prev, [blockName]: value } : prev));
  }

  function openTeleprompter() {
    if (!script) return;
    // Store script in sessionStorage for the teleprompter page
    sessionStorage.setItem("teleprompter-script", JSON.stringify(script));
    window.open("/teleprompter", "_blank");
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        tema={tema}
        setTema={setTema}
        grandeTema={grandeTema}
        setGrandeTema={setGrandeTema}
        publico={publico}
        setPublico={setPublico}
        onGenerate={handleGenerate}
        loading={loading}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {!script && !loading && (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <p className="text-4xl mb-4">🎬</p>
              <p className="text-lg font-medium">
                Preencha o tema e clique em Gerar
              </p>
              <p className="text-sm mt-1">
                O roteiro será gerado com 7 blocos editáveis
              </p>
            </div>
          </div>
        )}

        {loading && !script && (
          <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 mx-auto mb-4 text-accent"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-lg font-medium">Gerando roteiro…</p>
            </div>
          </div>
        )}

        {script && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Roteiro</h2>
              <button
                onClick={openTeleprompter}
                className="bg-surface-2 hover:bg-border border border-border text-text rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>📺</span>
                Abrir Teleprompter
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {BLOCK_ORDER.map((blockName) => (
                <ScriptBlock
                  key={blockName}
                  name={blockName}
                  value={script[blockName]}
                  onChange={(v) => handleBlockChange(blockName, v)}
                  onRegenerate={() => handleRegenerate(blockName)}
                  regenerating={regeneratingBlock === blockName}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
