"use client";

import { GRANDES_TEMAS, DEFAULT_PUBLICO } from "@/lib/types";

interface SidebarProps {
  tema: string;
  setTema: (v: string) => void;
  grandeTema: string;
  setGrandeTema: (v: string) => void;
  publico: string;
  setPublico: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function Sidebar({
  tema,
  setTema,
  grandeTema,
  setGrandeTema,
  publico,
  setPublico,
  onGenerate,
  loading,
}: SidebarProps) {
  return (
    <aside className="w-80 min-w-80 bg-surface border-r border-border p-6 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-accent">Roteiro Reels</h1>
        <p className="text-sm text-text-muted mt-1">
          Gerador de roteiro com teleprompter
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-muted">
          Tema / Memória
        </label>
        <textarea
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: A gente decorava telefone de cabeça e hoje não sabe o número do próprio filho…"
          className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent min-h-[100px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-muted">
          Grande Tema
        </label>
        <select
          value={grandeTema}
          onChange={(e) => setGrandeTema(e.target.value)}
          className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
        >
          {GRANDES_TEMAS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-muted">
          Público
        </label>
        <textarea
          value={publico}
          onChange={(e) => setPublico(e.target.value)}
          placeholder={DEFAULT_PUBLICO}
          className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent min-h-[60px]"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !tema.trim()}
        className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg px-4 py-3 text-sm transition-colors mt-auto cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
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
            Gerando…
          </span>
        ) : (
          "Gerar Roteiro"
        )}
      </button>
    </aside>
  );
}
