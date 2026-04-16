"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ScriptBlocks, BLOCK_LABELS, BlockName } from "@/lib/types";

const BLOCK_ORDER: BlockName[] = [
  "gancho",
  "identificacao",
  "conflito",
  "bordao",
  "virada",
  "transicao",
  "cta",
];

export default function TeleprompterPage() {
  const [script, setScript] = useState<ScriptBlocks | null>(null);
  const [fontSize, setFontSize] = useState(32);
  const [speed, setSpeed] = useState(50);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("teleprompter-script");
    if (stored) {
      setScript(JSON.parse(stored));
    }
  }, []);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.round((el.scrollTop / maxScroll) * 100));
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const el = scrollRef.current;
      if (el) {
        // speed: 1-100 → pixels per second: 10-150
        const pxPerSecond = 10 + (speed / 100) * 140;
        el.scrollTop += (pxPerSecond * delta) / 1000;
        updateProgress();

        const maxScroll = el.scrollHeight - el.clientHeight;
        if (el.scrollTop >= maxScroll) {
          setPlaying(false);
          return;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [speed, updateProgress]
  );

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    }
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [playing, animate]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === "Escape") {
        window.close();
      } else if (e.code === "KeyH") {
        setShowControls((s) => !s);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleScroll() {
    updateProgress();
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Nenhum roteiro carregado. Gere um roteiro primeiro.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative select-none">
      {/* Controls bar */}
      {showControls && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-white/10 px-6 py-3 flex items-center gap-6">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            {playing ? "⏸ Pausar" : "▶ Play"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Fonte</span>
            <input
              type="range"
              min={18}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span className="text-xs text-white/50 w-8">
              {fontSize}px
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Velocidade</span>
            <input
              type="range"
              min={1}
              max={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span className="text-xs text-white/50 w-8">{speed}%</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-mono text-amber-500">
              {progress}%
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-white/30 hover:text-white/60 text-xs cursor-pointer"
              title="Esconder controles (H para mostrar)"
            >
              Esconder
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-amber-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-auto px-8 md:px-16 lg:px-24"
        style={{ paddingTop: showControls ? "80px" : "40px", paddingBottom: "80vh" }}
      >
        <div className="max-w-4xl mx-auto">
          {BLOCK_ORDER.map((blockName, index) => (
            <div key={blockName} className={index > 0 ? "mt-10" : ""}>
              <div
                className="text-amber-500/60 text-xs uppercase tracking-widest mb-3 font-medium"
              >
                {BLOCK_LABELS[blockName]}
              </div>
              <p
                className={`leading-relaxed ${
                  blockName === "bordao"
                    ? "text-amber-500 font-bold italic"
                    : ""
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              >
                {script[blockName]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden controls hint */}
      {!showControls && (
        <div className="fixed top-4 right-4 z-50 text-white/20 text-xs">
          Pressione H para controles | Espaço para play/pause
        </div>
      )}
    </div>
  );
}
