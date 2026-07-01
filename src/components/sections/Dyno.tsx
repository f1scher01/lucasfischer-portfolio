"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

const MAX_RPM = 8200;
const REDLINE = 6900;

interface Engine {
  ctx: AudioContext;
  src: AudioBufferSourceNode | null;
  filter: BiquadFilterNode;
  gain: GainNode;
  ready: boolean;
  loading: boolean;
}

/**
 * Bancada interativa: segure o acelerador → o RPM sobe com inércia, a roda
 * gira e (se o som estiver ligado) ouve-se o motor — SAMPLE REAL (loop de motor
 * CC0/domínio público) com pitch (playbackRate) + filtro + volume dirigidos
 * pelo RPM via WebAudio. Carregado só após gesto do usuário. Sem auto-animação.
 */
export function Dyno() {
  const wheelRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rpmTextRef = useRef<HTMLSpanElement>(null);
  const speedTextRef = useRef<HTMLSpanElement>(null);

  const throttleRef = useRef(false);
  const rpmRef = useRef(0); // 0..1
  const engineRef = useRef<Engine | null>(null);
  const soundOnRef = useRef(false);

  const [held, setHeld] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let angle = 0;

    const loop = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;

      const target = throttleRef.current ? 1 : 0;
      const k = throttleRef.current ? 1.9 : 1.1;
      rpmRef.current += (target - rpmRef.current) * Math.min(1, dt * k);
      const rpm = rpmRef.current;
      const rpmVal = Math.round(rpm * MAX_RPM);

      angle = (angle + rpm * 1100 * dt) % 360;
      if (wheelRef.current) {
        wheelRef.current.setAttribute("transform", `rotate(${angle} 70 70)`);
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${rpm})`;
        barRef.current.style.background =
          rpmVal >= REDLINE ? "var(--color-danger)" : "var(--color-accent)";
      }
      if (rpmTextRef.current) {
        rpmTextRef.current.textContent = rpmVal.toLocaleString("pt-BR");
        rpmTextRef.current.style.color =
          rpmVal >= REDLINE ? "var(--color-danger)" : "var(--color-fg)";
      }
      if (speedTextRef.current) {
        speedTextRef.current.textContent = String(Math.round(rpm * 280));
      }

      const e = engineRef.current;
      if (e && e.ready && e.src) {
        const now = e.ctx.currentTime;
        // pitch real do motor: idle ~0.55x → redline ~2.6x
        e.src.playbackRate.setTargetAtTime(0.55 + rpm * 2.05, now, 0.06);
        // escape "abre" com o giro
        e.filter.frequency.setTargetAtTime(700 + rpm * 7200, now, 0.06);
        const g = soundOnRef.current ? Math.min(0.06 + rpm * 0.5, 0.62) : 0;
        e.gain.gain.setTargetAtTime(g, now, 0.05);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      const e = engineRef.current;
      if (e) {
        try {
          e.src?.stop();
          void e.ctx.close();
        } catch {
          /* noop */
        }
        engineRef.current = null;
      }
    };
  }, []);

  function ensureEngine() {
    if (engineRef.current) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      filter.Q.value = 1;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      filter.connect(gain);
      gain.connect(ctx.destination);

      const engine: Engine = {
        ctx,
        src: null,
        filter,
        gain,
        ready: false,
        loading: true,
      };
      engineRef.current = engine;

      // carrega o sample real (CC0) e cria a fonte em loop
      fetch("/sounds/engine.wav")
        .then((r) => r.arrayBuffer())
        .then((b) => ctx.decodeAudioData(b))
        .then((buffer) => {
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(filter);
          src.start();
          engine.src = src;
          engine.ready = true;
          engine.loading = false;
        })
        .catch(() => {
          engine.loading = false;
        });
    } catch {
      /* WebAudio indisponível — segue só no visual */
    }
  }

  function press() {
    throttleRef.current = true;
    setHeld(true);
    if (soundOnRef.current) {
      ensureEngine();
      void engineRef.current?.ctx.resume?.();
    }
  }
  function release() {
    throttleRef.current = false;
    setHeld(false);
  }
  function toggleSound() {
    const v = !soundOnRef.current;
    soundOnRef.current = v;
    setSoundOn(v);
    if (v) {
      ensureEngine();
      void engineRef.current?.ctx.resume?.();
    }
  }

  // 6 raios da roda
  const spokes = Array.from({ length: 6 }, (_, i) => i * 60);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-28">
      <div className="container-x">
        <ScrollReveal className="mb-10 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">↻</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">{t.dyno.eyebrow}</p>
        </ScrollReveal>

        <div className="grid items-center gap-12 md:grid-cols-12">
          <ScrollReveal className="md:col-span-5">
            <RevealHeading
              key={lang}
              segments={[
                { text: t.dyno.h1 },
                {
                  text: t.dyno.h2,
                  className: "text-[var(--color-accent)]",
                  br: true,
                },
              ]}
              className="font-display text-3xl leading-tight tracking-tight md:text-5xl"
            />
            <p className="mt-5 max-w-md text-[var(--color-fg-muted)]">
              {t.dyno.desc}
            </p>
          </ScrollReveal>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-8">
              <div className="flex items-center gap-8">
                {/* Roda */}
                <svg
                  viewBox="0 0 140 140"
                  className="h-28 w-28 shrink-0 md:h-36 md:w-36"
                  aria-hidden
                >
                  <circle cx="70" cy="70" r="66" fill="#0c0e12" stroke="var(--color-border-strong)" strokeWidth="6" />
                  <g ref={wheelRef}>
                    <circle cx="70" cy="70" r="52" fill="none" stroke="var(--color-fg-dim)" strokeWidth="2" />
                    {spokes.map((deg) => (
                      <line
                        key={deg}
                        x1="70"
                        y1="70"
                        x2="70"
                        y2="20"
                        stroke="var(--color-fg-muted)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        transform={`rotate(${deg} 70 70)`}
                      />
                    ))}
                    <circle cx="70" cy="70" r="12" fill="var(--color-accent)" />
                    <circle cx="70" cy="20" r="3" fill="var(--color-accent)" />
                  </g>
                </svg>

                {/* Telemetria */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-end gap-2 font-mono">
                    <span
                      ref={rpmTextRef}
                      className="text-4xl tabular-nums text-[var(--color-fg)] md:text-5xl"
                    >
                      0
                    </span>
                    <span className="mb-1 caption text-[var(--color-fg-muted)]">
                      rpm
                    </span>
                  </div>

                  {/* Barra de RPM */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      ref={barRef}
                      className="h-full origin-left rounded-full bg-[var(--color-accent)]"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-[var(--color-fg-dim)]">
                    <span>0</span>
                    <span className="text-[var(--color-danger)]">
                      {t.dyno.redline} {REDLINE.toLocaleString("pt-BR")}
                    </span>
                    <span>{MAX_RPM.toLocaleString("pt-BR")}</span>
                  </div>

                  <p className="mt-4 font-mono text-xs text-[var(--color-fg-dim)]">
                    {t.dyno.speed}{" "}
                    <span ref={speedTextRef} className="text-[var(--color-fg-muted)]">
                      0
                    </span>{" "}
                    km/h
                  </p>
                </div>
              </div>

              {/* Controles */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  data-cursor="magnetic"
                  onPointerDown={press}
                  onPointerUp={release}
                  onPointerLeave={release}
                  onPointerCancel={release}
                  className={`select-none rounded-full border px-8 py-3 text-sm font-medium transition-colors ${
                    held
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]"
                      : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                  }`}
                >
                  {held ? t.dyno.holding : t.dyno.hold}
                </button>

                <button
                  type="button"
                  data-cursor="link"
                  onClick={toggleSound}
                  aria-pressed={soundOn}
                  className="rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                >
                  {soundOn ? t.dyno.soundOn : t.dyno.soundOff}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
