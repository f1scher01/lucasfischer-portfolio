"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

/* ============================== modelo veicular ==============================
 * 6 marchas (ratio 0.72), corte de torque na troca, embreagem suavizada no
 * lançamento, arrasto ∝ v e freio-motor. 0–100 km/h ≈ 3,2 s (supercarro).
 * ========================================================================== */
const IDLE = 1000;
const MAX_RPM = 8000;
const SHIFT_AT = 7900;
const DOWNSHIFT_AT = 2800;
const RATIO_STEP = 0.72;
const GEARS = 6;
const SHIFT_TIME = 0.22;
const K1 = 62 / 8000; // km/h por rpm em 1ª
const RPM_RATE = [5200, 2900, 2100, 1500, 1050, 750];

const kSpeed = (gear: number) => K1 * Math.pow(1 / RATIO_STEP, gear - 1);

/* ============================== áudio multi-band =============================
 * Como em jogo de corrida: 3 gravações reais (CC0, OpenGameArt) em bandas de
 * RPM cruzadas por crossfade — cada uma estica no MÁXIMO ±45% de pitch (nada
 * de chipmunk). Sub-oscilador dá o corpo grave; waveshaper dá o rasgo; pops
 * de escape estouram na troca de marcha. Compressor cola tudo.
 * ========================================================================== */
const BANDS = [
  { file: "/sounds/engine-low.wav", center: 2200, in: [0, 0], out: [2600, 4400] },
  { file: "/sounds/engine-mid.wav", center: 4800, in: [2600, 4400], out: [5800, 7400] },
  { file: "/sounds/engine-high.wav", center: 7200, in: [5800, 7400], out: [99999, 99999] },
] as const;

function bandGain(rpm: number, b: (typeof BANDS)[number]): number {
  const rise =
    rpm <= b.in[0] ? 0 : rpm >= b.in[1] ? 1 : (rpm - b.in[0]) / (b.in[1] - b.in[0] || 1);
  const fall =
    rpm <= b.out[0] ? 1 : rpm >= b.out[1] ? 0 : 1 - (rpm - b.out[0]) / (b.out[1] - b.out[0] || 1);
  return Math.min(rise, fall);
}

interface Engine {
  ctx: AudioContext;
  srcs: (AudioBufferSourceNode | null)[];
  bandGains: GainNode[];
  sub: OscillatorNode;
  subGain: GainNode;
  master: GainNode;
  comp: DynamicsCompressorNode;
  noise: AudioBuffer | null;
  blip: AudioBuffer | null; // gravação REAL de V8 (Mercedes S63 AMG, CC0)
  duckUntil: number; // enquanto o blip toca, os loops abaixam
  ready: boolean;
}

/** Rajada de estouros de escape (burble/overrun) — o som de soltar o pé. */
function playBurble(e: Engine, intensity: number) {
  if (!e.noise) return;
  const t0 = e.ctx.currentTime;
  const n = 5 + Math.floor(intensity * 7);
  let t = t0;
  for (let i = 0; i < n; i++) {
    t += 0.035 + Math.random() * 0.075;
    const pop = e.ctx.createBufferSource();
    pop.buffer = e.noise;
    pop.playbackRate.value = 0.55 + Math.random() * 0.7;
    const bp = e.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 220 + Math.random() * 560;
    bp.Q.value = 0.9;
    const g = e.ctx.createGain();
    const loud = (0.2 + Math.random() * 0.42) * intensity;
    g.gain.setValueAtTime(loud, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.06);
    pop.connect(bp);
    bp.connect(g);
    g.connect(e.comp);
    pop.start(t);
    pop.stop(t + 0.13);
  }
}

/** Toca a gravação real de rev (na ativação do som) e abaixa os loops. */
function playRevBlip(e: Engine) {
  if (!e.blip) return;
  const src = e.ctx.createBufferSource();
  src.buffer = e.blip;
  const g = e.ctx.createGain();
  g.gain.value = 0.9;
  src.connect(g);
  g.connect(e.comp);
  src.start();
  e.duckUntil = e.ctx.currentTime + e.blip.duration - 0.5;
}

export function Dyno() {
  const wheelRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const ledsRef = useRef<HTMLDivElement>(null);
  const rpmTextRef = useRef<HTMLSpanElement>(null);
  const speedTextRef = useRef<HTMLSpanElement>(null);
  const gearTextRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);

  const throttleRef = useRef(false);
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
    // veículo
    let rpm = IDLE;
    let gear = 1;
    let speed = 0;
    let shiftT = 0;
    let shiftPopPending = false;
    let prevOn = false; // p/ detectar lift-off (solta o acelerador)
    // cronômetro 0-100 — máquina de estados explícita
    let runState: "ready" | "running" | "done" = "ready";
    let t0 = 0;
    let lastTime: number | null = null;
    let best: number | null = null;
    try {
      const b = localStorage.getItem("dyno-best");
      if (b) best = Number(b);
    } catch {
      /* noop */
    }
    if (bestRef.current && best !== null) {
      bestRef.current.textContent = `${best.toFixed(2)} s`;
    }

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      const on = throttleRef.current;

      // ===== física =====
      if (shiftT > 0) {
        shiftT -= dt;
      } else if (on) {
        rpm += RPM_RATE[gear - 1] * dt;
        if (rpm >= SHIFT_AT && gear < GEARS) {
          gear += 1;
          rpm *= RATIO_STEP;
          shiftT = SHIFT_TIME;
          shiftPopPending = true;
        }
        rpm = Math.min(rpm, MAX_RPM);
      } else {
        speed = Math.max(0, speed - (8 + speed * 0.045) * dt);
        rpm = speed > 0.5 ? speed / kSpeed(gear) : Math.max(IDLE, rpm - 3500 * dt);
        if (rpm < DOWNSHIFT_AT && gear > 1) {
          gear -= 1;
          rpm = speed / kSpeed(gear);
        }
        if (speed < 0.5) gear = 1;
      }
      // embreagem: velocidade persegue rpm·k suavemente (sem teleporte no launch)
      if (on || shiftT > 0) {
        const target = rpm * kSpeed(gear);
        speed += (target - speed) * Math.min(1, dt * 9);
      }

      // ===== cronômetro 0-100 =====
      if (on && runState !== "running" && speed < 1) {
        runState = "running";
        t0 = now;
      }
      if (runState === "running") {
        if (!on && speed < 100) {
          runState = "ready"; // abortou o lançamento
        } else if (speed >= 100) {
          runState = "done";
          lastTime = (now - t0) / 1000;
          if (best === null || lastTime < best) {
            best = lastTime;
            try {
              localStorage.setItem("dyno-best", String(best));
            } catch {
              /* noop */
            }
            if (bestRef.current) {
              bestRef.current.textContent = `${best.toFixed(2)} s`;
            }
          }
        }
      }
      if (runState === "done" && speed < 0.5) runState = "ready";

      // ===== UI (DOM direto) =====
      angle = (angle + speed * 144 * dt) % 360;
      wheelRef.current?.setAttribute("transform", `rotate(${angle} 70 70)`);
      const rpmFrac = (rpm - IDLE) / (MAX_RPM - IDLE);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(rpmFrac, 0.02)})`;
        barRef.current.style.background =
          rpm >= SHIFT_AT - 200 ? "var(--color-danger)" : "var(--color-accent)";
      }
      // shift lights F1: verdes → laranjas → vermelhas; piscam no limitador
      if (ledsRef.current) {
        const leds = ledsRef.current.children;
        const lit = Math.floor(rpmFrac * leds.length + 0.001);
        const blink = rpm >= SHIFT_AT - 60 && (Math.floor(now / 90) & 1) === 0;
        for (let i = 0; i < leds.length; i++) {
          const el = leds[i] as HTMLElement;
          const color =
            i < 4
              ? "var(--color-success)"
              : i < 8
                ? "var(--color-warning)"
                : "var(--color-danger)";
          el.style.background = color;
          el.style.opacity = blink ? "0.1" : i < lit ? "1" : "0.12";
        }
      }
      if (rpmTextRef.current) {
        rpmTextRef.current.textContent = String(Math.round(rpm / 10) * 10);
      }
      if (speedTextRef.current) {
        speedTextRef.current.textContent = String(Math.round(speed));
      }
      if (gearTextRef.current) {
        gearTextRef.current.textContent = speed < 0.5 && !on ? "N" : String(gear);
      }
      if (timerRef.current) {
        if (runState === "running") {
          timerRef.current.textContent = `${((now - t0) / 1000).toFixed(2)} s`;
          timerRef.current.style.color = "var(--color-fg-muted)";
        } else if (lastTime !== null) {
          timerRef.current.textContent = `${lastTime.toFixed(2)} s`;
          timerRef.current.style.color = "var(--color-accent)";
        } else {
          timerRef.current.textContent = "—";
          timerRef.current.style.color = "var(--color-fg-dim)";
        }
      }

      // ===== áudio =====
      const e = engineRef.current;
      if (e && e.ready) {
        const tNow = e.ctx.currentTime;
        // burble de escape ao SOLTAR o acelerador em giro alto (overrun)
        if (prevOn && !on && rpm > 4200 && soundOnRef.current) {
          playBurble(e, Math.min((rpm - 3500) / (MAX_RPM - 3500), 1));
        }
        const cut = shiftT > 0 ? 0.3 : 1;
        const duck = tNow < e.duckUntil ? 0.22 : 1; // blip real em 1º plano
        for (let i = 0; i < BANDS.length; i++) {
          const src = e.srcs[i];
          if (!src) continue;
          const rate = Math.min(Math.max(rpm / BANDS[i].center, 0.62), 1.45);
          src.playbackRate.setTargetAtTime(rate, tNow, 0.05);
          const g = soundOnRef.current
            ? bandGain(rpm, BANDS[i]) * (0.2 + rpmFrac * 0.55) * cut * duck
            : 0;
          e.bandGains[i].gain.setTargetAtTime(g, tNow, 0.05);
        }
        // sub: frequência de explosões (ordem 2 de um V8) — corpo grave
        e.sub.frequency.setTargetAtTime(30 + rpmFrac * 190, tNow, 0.05);
        e.subGain.gain.setTargetAtTime(
          soundOnRef.current ? (0.06 + rpmFrac * 0.2) * cut : 0,
          tNow,
          0.05,
        );
        // pop de escape na troca
        if (shiftPopPending && soundOnRef.current && e.noise) {
          shiftPopPending = false;
          const pop = e.ctx.createBufferSource();
          pop.buffer = e.noise;
          const bp = e.ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 600 + Math.random() * 700;
          bp.Q.value = 1.2;
          const pg = e.ctx.createGain();
          pg.gain.setValueAtTime(0.5, tNow);
          pg.gain.exponentialRampToValueAtTime(0.001, tNow + 0.14);
          pop.connect(bp);
          bp.connect(pg);
          pg.connect(e.comp);
          pop.start(tNow);
          pop.stop(tNow + 0.15);
        } else if (shiftPopPending) {
          shiftPopPending = false;
        }
      }
      prevOn = on;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      const e = engineRef.current;
      if (e) {
        try {
          e.srcs.forEach((s) => s?.stop());
          e.sub.stop();
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

      // compressor no master — cola as bandas e evita clipping
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.ratio.value = 6;
      comp.attack.value = 0.004;
      comp.release.value = 0.18;
      comp.connect(ctx.destination);

      const master = ctx.createGain();
      master.gain.value = 1;

      // rasgo de escape: soft-clip
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(2.2 * x);
      }
      shaper.curve = curve;
      shaper.oversample = "2x";
      shaper.connect(master);
      master.connect(comp);

      const sub = ctx.createOscillator();
      sub.type = "triangle";
      sub.frequency.value = 30;
      const subGain = ctx.createGain();
      subGain.gain.value = 0;
      sub.connect(subGain);
      subGain.connect(comp);
      sub.start();

      // buffer de ruído p/ pops de escape
      const noiseLen = Math.floor(ctx.sampleRate * 0.15);
      const noise = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
      const nd = noise.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) nd[i] = Math.random() * 2 - 1;

      const engine: Engine = {
        ctx,
        srcs: [null, null, null],
        bandGains: BANDS.map(() => {
          const g = ctx.createGain();
          g.gain.value = 0;
          g.connect(shaper);
          return g;
        }),
        sub,
        subGain,
        master,
        comp,
        noise,
        blip: null,
        duckUntil: 0,
        ready: false,
      };
      engineRef.current = engine;

      Promise.all([
        ...BANDS.map((b) =>
          fetch(b.file)
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf)),
        ),
        // gravação real: Mercedes S63 AMG V8 biturbo (freesound 505321, CC0)
        fetch("/sounds/rev-blip.mp3")
          .then((r) => r.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .catch(() => null),
      ])
        .then((buffers) => {
          BANDS.forEach((_, i) => {
            const buffer = buffers[i];
            if (!buffer) return;
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.loop = true;
            src.connect(engine.bandGains[i]);
            src.start();
            engine.srcs[i] = src;
          });
          engine.blip = buffers[BANDS.length] ?? null;
          engine.ready = true;
          // "partida": rev real de V8 dá o tom assim que o som liga
          if (soundOnRef.current) playRevBlip(engine);
        })
        .catch(() => {});
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
      const hadEngine = !!engineRef.current;
      ensureEngine();
      const e = engineRef.current;
      void e?.ctx.resume?.();
      // religou com engine já carregada → rev de partida de novo
      if (hadEngine && e?.ready) playRevBlip(e);
    }
  }

  const spokes = Array.from({ length: 6 }, (_, i) => i * 60);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-32">
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
            <p className="mt-4 font-mono text-xs text-[var(--color-fg-dim)]">
              {t.dyno.specs}
            </p>
          </ScrollReveal>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-8">
              {/* shift lights F1 */}
              <div ref={ledsRef} className="mb-6 flex justify-center gap-2" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full transition-opacity duration-75"
                    style={{ opacity: 0.12, background: "var(--color-success)" }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-8">
                {/* Roda — gira com a velocidade real */}
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
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
                    <div className="flex items-end gap-2 font-mono">
                      <span
                        ref={speedTextRef}
                        className="text-5xl font-bold tabular-nums text-[var(--color-fg)] md:text-6xl"
                      >
                        0
                      </span>
                      <span className="mb-1.5 caption text-[var(--color-fg-muted)]">
                        km/h
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 font-mono">
                      <div className="text-center">
                        <span
                          ref={gearTextRef}
                          className="block text-2xl font-bold text-[var(--color-accent)] md:text-3xl"
                        >
                          N
                        </span>
                        <span className="caption text-[var(--color-fg-dim)]">
                          {t.dyno.gear}
                        </span>
                      </div>
                      <div className="text-center">
                        <span
                          ref={timerRef}
                          className="block whitespace-nowrap text-xl font-bold tabular-nums text-[var(--color-fg-dim)] md:text-2xl"
                        >
                          —
                        </span>
                        <span className="caption text-[var(--color-fg-dim)]">
                          0–100
                        </span>
                      </div>
                      <div className="text-center">
                        <span
                          ref={bestRef}
                          className="block whitespace-nowrap text-xl font-bold tabular-nums text-[var(--color-success)] md:text-2xl"
                        >
                          —
                        </span>
                        <span className="caption text-[var(--color-fg-dim)]">
                          {t.dyno.best}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tacômetro */}
                  <div className="mt-4 flex items-baseline justify-between font-mono text-xs text-[var(--color-fg-dim)]">
                    <span>
                      <span ref={rpmTextRef} className="text-[var(--color-fg-muted)]">1000</span> rpm
                    </span>
                    <span className="text-[var(--color-danger)]">
                      {t.dyno.redline} {SHIFT_AT.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      ref={barRef}
                      className="h-full origin-left rounded-full bg-[var(--color-accent)]"
                      style={{ transform: "scaleX(0.02)" }}
                    />
                  </div>
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
