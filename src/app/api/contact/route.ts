import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
import { deliverContact } from "@/lib/contact-store";

/**
 * Réception du formulaire de contact (public).
 * Anti-spam : champ piège invisible + limite de débit par adresse IP.
 */

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/** Limite best-effort, par instance serverless. Suffisant contre les envois en rafale. */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège : rempli uniquement par les robots. On n'enregistre rien.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop d'envois rapprochés. Réessayez dans quelques minutes, ou écrivez-moi directement par e-mail." },
      { status: 429 }
    );
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Certains champs sont à corriger.", fields: result.errors }, { status: 400 });
  }

  const delivery = await deliverContact(result.data);
  if (!delivery.ok) {
    return NextResponse.json(
      {
        error:
          delivery.reason === "not_configured"
            ? "Le formulaire n'est pas encore activé sur ce site. Écrivez-moi directement par e-mail."
            : "Votre message n'a pas pu être transmis. Réessayez, ou écrivez-moi directement par e-mail.",
        reason: delivery.reason,
      },
      { status: delivery.reason === "not_configured" ? 503 : 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
