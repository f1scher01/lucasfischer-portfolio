"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { useLang } from "@/i18n/LangProvider";

/* ============================== modelo veicular ==============================
 * Câmbio de 6 marchas, relação de ~0.72 entre marchas, corte de torque de
 * 220 ms na troca, arrasto aerodinâmico + freio-motor na desaceleração.
 * Velocidade contínua nas trocas (v = rpm · k(g), k cresce 1/0.72 por marcha).
 * Resultado: 0–100 km/h ≈ 3.1 s — território de supercarro (F8/720S).
 * ========================================================================== */
const IDLE = 1000;
const MAX_RPM = 8000;
const SHIFT_AT = 7900;
const DOWNSHIFT_AT = 2800;
const RATIO_STEP = 0.72; // queda de rpm ao subir marcha
const GEARS = 6;
const SHIFT_TIME = 0.22; // s de corte de torque
const K1 = 62 / 8000; // km/h por rpm em 1ª (62 km/h @ 8000)
const RPM_RATE = [5200, 2900, 2100, 1500, 1050, 750]; // rpm/s por marcha

const kSpeed = (gear: number) => K1 * Math.pow(1 / RATIO_STEP, gear - 1);

interface Engine {
  ctx: AudioContext;
  src: AudioBufferSourceNode | null;
  sub: OscillatorNode;
  subGain: GainNode;
  gain: GainNode;
  ready: boolean;
}

export function Dyno() {
  const wheelRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rpmTextRef = useRef<HTMLSpanElement>(null);
  const speedTextRef = useRef<HTMLSpanElement>(null);
  const gearTextRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);

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
    // estado do veículo
    let rpm = IDLE;
    let gear = 1;
    let speed = 0; // km/h
    let shiftT = 0; // corte de torque restante (s)
    // cronômetro 0-100
    let launchT: number | null = null;
    let time100: number | null = null;

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      const on = throttleRef.current;

      if (shiftT > 0) {
        // troca de marcha: torque cortado, rpm cai pro alvo da nova marcha
        shiftT -= dt;
      } else if (on) {
        rpm += RPM_RATE[gear - 1] * dt;
        if (rpm >= SHIFT_AT && gear < GEARS) {
          gear += 1;
          rpm *= RATIO_STEP;
          shiftT = SHIFT_TIME;
        }
        rpm = Math.min(rpm, MAX_RPM);
        speed = rpm * kSpeed(gear);
      } else {
        // freio-motor + arrasto aerodinâmico
        speed = Math.max(0, speed - (8 + speed * 0.045) * dt);
        rpm = speed > 0.5 ? speed / kSpeed(gear) : IDLE;
        if (rpm < DOWNSHIFT_AT && gear > 1) {
          gear -= 1;
          rpm = speed / kSpeed(gear);
        }
        if (speed < 0.5) {
          gear = 1;
          rpm = Math.max(IDLE, rpm - 3000 * dt);
        }
      }

      // cronômetro 0-100 (lançamento de parado)
      if (on && speed > 0.5 && launchT === null && time100 === null) {
        launchT = now;
      }
      if (launchT !== null && time100 === null && speed >= 100) {
        time100 = (now - launchT) / 1000;
      }
      if (!on && speed < 0.5) {
        launchT = null;
        if (time100 !== null && !throttleRef.current) {
          // mantém o último tempo exibido até novo lançamento
        }
      }
      if (on && speed < 0.5 && time100 !== null && launchT === null) {
        time100 = null; // novo lançamento zera
      }

      // ===== UI (DOM direto — hot path) =====
      // roda gira com a VELOCIDADE (raio ~0.33 m → graus/s ≈ v*144)
      angle = (angle + speed * 144 * dt) % 360;
      if (wheelRef.current) {
        wheelRef.current.setAttribute("transform", `rotate(${angle} 70 70)`);
      }
      const rpmFrac = (rpm - IDLE) / (MAX_RPM - IDLE);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(rpmFrac, 0.02)})`;
        barRef.current.style.background =
          rpm >= SHIFT_AT - 200
            ? "var(--color-danger)"
            : "var(--color-accent)";
      }
      if (rpmTextRef.current) {
        rpmTextRef.current.textContent = String(Math.round(rpm / 10) * 10);
      }
      if (speedTextRef.current) {
        speedTextRef.current.textContent = String(Math.round(speed));
      }
      if (gearTextRef.current) {
        gearTextRef.current.textContent =
          speed < 0.5 && !on ? "N" : String(gear);
      }
      if (timerRef.current) {
        if (time100 !== null) {
          timerRef.current.textContent = `${time100.toFixed(2)} s`;
          timerRef.current.style.color = "var(--color-accent)";
        } else if (launchT !== null) {
          timerRef.current.textContent = `${((now - launchT) / 1000).toFixed(2)} s`;
          timerRef.current.style.color = "var(--color-fg-muted)";
        } else {
          timerRef.current.textContent = "—";
          timerRef.current.style.color = "var(--color-fg-dim)";
        }
      }

      // ===== áudio =====
      const e = engineRef.current;
      if (e && e.ready && e.src) {
        const tNow = e.ctx.currentTime;
        const f = rpm / MAX_RPM; // 0.125..1
        e.src.playbackRate.setTargetAtTime(0.45 + f * 2.35, tNow, 0.05);
        e.sub.frequency.setTargetAtTime(28 + f * 92, tNow, 0.05);
        const cut = shiftT > 0 ? 0.35 : 1; // corte na troca = respiro do câmbio
        const g = soundOnRef.current ? (0.1 + f * 0.55) * cut : 0;
        e.gain.gain.setTargetAtTime(Math.min(g, 0.7), tNow, 0.04);
        e.subGain.gain.setTargetAtTime(
          soundOnRef.current ? (0.05 + f * 0.22) * cut : 0,
          tNow,
          0.05,
        );
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

      // distorção soft-clip — dá "rasgo" de escape ao sample
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(2.6 * x);
      }
      shaper.curve = curve;
      shaper.oversample = "2x";

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 5200;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      // sub-oscilador: corpo grave de V8 por baixo do sample
      const sub = ctx.createOscillator();
      sub.type = "triangle";
      sub.frequency.value = 30;
      const subGain = ctx.createGain();
      subGain.gain.value = 0;
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start();

      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const engine: Engine = { ctx, src: null, sub, subGain, gain, ready: false };
      engineRef.current = engine;

      fetch("/sounds/engine.wav")
        .then((r) => r.arrayBuffer())
        .then((b) => ctx.decodeAudioData(b))
        .then((buffer) => {
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          src.connect(shaper);
          src.start();
          engine.src = src;
          engine.ready = true;
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
      ensureEngine();
      void engineRef.current?.ctx.resume?.();
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
                  <div className="flex items-end justify-between gap-4">
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
                    <div className="flex items-center gap-4 font-mono">
                      <div className="text-center">
                        <span
                          ref={gearTextRef}
                          className="block text-3xl font-bold text-[var(--color-accent)] md:text-4xl"
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
                          className="block text-2xl font-bold tabular-nums text-[var(--color-fg-dim)] md:text-3xl"
                        >
                          —
                        </span>
                        <span className="caption text-[var(--color-fg-dim)]">
                          0–100
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
