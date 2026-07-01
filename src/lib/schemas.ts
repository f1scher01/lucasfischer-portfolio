import { z } from "zod";

// Domínios descartáveis mais comuns — rejeição básica de spam.
const DISPOSABLE = [
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
];

/** Schema estrito do formulário de contato — usado no client E no server. */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nome muito curto")
    .max(80, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome contém caracteres inválidos")
    .transform((s) => s.trim().replace(/[\r\n]/g, "")),
  email: z
    .string()
    .email("Email inválido")
    .max(254)
    .refine(
      (e) => !DISPOSABLE.includes(e.split("@")[1]?.toLowerCase() ?? ""),
      "Use um email permanente",
    ),
  message: z
    .string()
    .min(20, "Mensagem muito curta (mín. 20 caracteres)")
    .max(2000, "Mensagem muito longa (máx. 2000)")
    .transform((s) => s.trim()),
});

export type ContactInput = z.infer<typeof contactSchema>;
