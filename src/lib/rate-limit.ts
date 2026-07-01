import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limit do formulário: 3 envios / 10 min por IP.
 * Com UPSTASH_REDIS_REST_URL + TOKEN → Upstash (persistente entre instâncias).
 * Sem envs → fallback in-memory (por instância serverless; suficiente para
 * portfólio, trade-off documentado em docs/threat-model.md).
 */

const LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

let upstash: Ratelimit | null = null;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  upstash = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
    prefix: "contact",
  });
}

// fallback in-memory: janela deslizante simples
const hits = new Map<string, number[]>();

export async function checkRateLimit(
  ip: string,
): Promise<{ success: boolean }> {
  if (upstash) {
    try {
      const { success } = await upstash.limit(ip);
      return { success };
    } catch {
      // Upstash indisponível → não bloquear o form por infra externa
      return { success: true };
    }
  }
  const now = Date.now();
  const windowHits = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (windowHits.length >= LIMIT) {
    hits.set(ip, windowHits);
    return { success: false };
  }
  windowHits.push(now);
  hits.set(ip, windowHits);
  // higiene: não deixa o Map crescer sem limite
  if (hits.size > 5000) hits.clear();
  return { success: true };
}
