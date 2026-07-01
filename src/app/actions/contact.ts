"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
}

const GENERIC_FAIL: ContactState = {
  status: "error",
  message: "Falha na verificação. Tente novamente ou use o email direto.",
};

/** Valida token do Cloudflare Turnstile (se configurado). */
async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // não configurado → outros guards seguram
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 1) Origem: em produção o POST deve vir do próprio site
  const origin = h.get("origin");
  const host = h.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return GENERIC_FAIL;
  }

  // 2) Honeypot: campo invisível — humanos não preenchem
  if ((formData.get("company") as string)?.length) {
    // responde como sucesso para não ensinar o bot
    return { status: "success", message: "Mensagem enviada." };
  }

  // 3) Timestamp: submit < 3s após render = bot
  const ts = Number(formData.get("_ts"));
  if (!Number.isFinite(ts) || Date.now() - ts < 3000) {
    return GENERIC_FAIL;
  }

  // 4) Rate limit por IP (Upstash ou in-memory)
  const { success: allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return {
      status: "error",
      message: "Muitas tentativas. Tente de novo em alguns minutos.",
    };
  }

  // 5) Turnstile (se configurado)
  const human = await verifyTurnstile(
    formData.get("cf-turnstile-response") as string | null,
    ip,
  );
  if (!human) return GENERIC_FAIL;

  // 6) Validação estrita
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        (key === "name" || key === "email" || key === "message") &&
        !errors[key]
      ) {
        errors[key] = issue.message;
      }
    }
    return { status: "error", message: "Confira os campos destacados.", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    return {
      status: "error",
      message: "Serviço de email não configurado. Use o email direto ao lado.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { name, email, message } = parsed.data;
    // email TEXT (não HTML) → sem vetor XSS; name já sem \r\n (schema)
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Novo contato — ${name}`.slice(0, 140),
      text: `De: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
    });
    if (error) {
      return {
        status: "error",
        message: "Falha ao enviar. Tente novamente ou use o email direto.",
      };
    }
    return {
      status: "success",
      message: "Mensagem enviada. Obrigado — respondo em breve.",
    };
  } catch {
    return {
      status: "error",
      message: "Erro inesperado. Tente novamente ou use o email direto.",
    };
  }
}
