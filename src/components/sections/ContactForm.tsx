"use client";

import { useActionState, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Turnstile } from "@marsidev/react-turnstile";
import { sendContact, type ContactState } from "@/app/actions/contact";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full border-0 border-b border-[var(--color-border-strong)] bg-transparent py-2 text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-fg-dim)] focus:border-[var(--color-accent)]";

function Field({
  label,
  name,
  type = "text",
  multiline,
  error,
}: {
  label: string;
  name: "name" | "email" | "message";
  type?: string;
  multiline?: boolean;
  error?: string;
}) {
  const errId = error ? `${name}-error` : undefined;
  return (
    <div>
      <label htmlFor={name} className="caption mb-2 block text-[var(--color-fg-muted)]">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required
          aria-invalid={!!error}
          aria-describedby={errId}
          className={inputClass + " resize-none"}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required
          aria-invalid={!!error}
          aria-describedby={errId}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={errId} className="mt-1 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  // timestamp de render (anti-bot): setado no client pós-mount
  const [ts, setTs] = useState(0);
  useEffect(() => setTs(Date.now()), []);

  if (state.status === "success") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl text-[var(--color-fg)]"
        role="status"
      >
        {state.message}
      </motion.p>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {/* honeypot — invisível para humanos, irresistível para bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Empresa</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="_ts" value={ts} />

      <Field label="Nome" name="name" error={state.errors?.name} />
      <Field label="Email" name="email" type="email" error={state.errors?.email} />
      <Field label="Mensagem" name="message" multiline error={state.errors?.message} />

      {state.status === "error" && !state.errors ? (
        <p className="text-sm text-[var(--color-danger)]" role="alert">
          {state.message}
        </p>
      ) : null}

      {TURNSTILE_SITE_KEY ? (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          options={{ size: "invisible" }}
        />
      ) : null}

      <button
        type="submit"
        disabled={pending}
        data-cursor="magnetic"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar mensagem →"}
      </button>
    </form>
  );
}
