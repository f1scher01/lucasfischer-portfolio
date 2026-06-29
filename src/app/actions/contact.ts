"use server";

import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensagem muito curta (mín. 10 caracteres)"),
});

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
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
    // Sem credenciais (ex.: env não configurado) — falha de forma honesta.
    return {
      status: "error",
      message: "Serviço de email não configurado. Use o email direto abaixo.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { name, email, message } = parsed.data;
    // from "onboarding@resend.dev" funciona sem verificar domínio enquanto o
    // destinatário (CONTACT_EMAIL) for a própria conta Resend. Para receber
    // de qualquer remetente em produção, verifique um domínio no Resend.
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Novo contato — ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      return {
        status: "error",
        message: "Falha ao enviar. Tente novamente ou use o email direto.",
      };
    }
    return { status: "success", message: "Mensagem enviada. Obrigado — respondo em breve." };
  } catch {
    return {
      status: "error",
      message: "Erro inesperado. Tente novamente ou use o email direto.",
    };
  }
}
