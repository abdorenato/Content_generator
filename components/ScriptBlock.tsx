"use client";

import { BlockName, BLOCK_LABELS, BLOCK_DESCRIPTIONS } from "@/lib/types";

interface ScriptBlockProps {
  name: BlockName;
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  regenerating: boolean;
}

export default function ScriptBlock({
  name,
  value,
  onChange,
  onRegenerate,
  regenerating,
}: ScriptBlockProps) {
  const isBordao = name === "bordao";

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-2">
        <div>
          <span className="text-sm font-semibold text-accent">
            {BLOCK_LABELS[name]}
          </span>
          <span className="text-xs text-text-muted ml-2">
            {BLOCK_DESCRIPTIONS[name]}
          </span>
        </div>
        {!isBordao && (
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            title="Regerar este bloco"
            className="text-text-muted hover:text-accent disabled:opacity-40 transition-colors p-1 cursor-pointer"
          >
            {regenerating ? (
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
            ) : (
              <span className="text-base">↺</span>
            )}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isBordao}
        className={`w-full bg-transparent px-4 py-3 text-sm text-text focus:outline-none min-h-[60px] ${
          isBordao
            ? "text-accent font-bold italic cursor-default"
            : ""
        }`}
        rows={Math.max(2, Math.ceil(value.length / 80))}
      />
    </div>
  );
}
