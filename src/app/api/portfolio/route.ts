import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { adminEnabled, isAuthenticated, passwordConfigured } from "@/lib/auth";
import { getPortfolio, savePortfolio } from "@/lib/portfolio-store";
import { getSupabase, supabaseConfigError } from "@/lib/supabase";

/**
 * API d'édition du contenu du portfolio (protégée par session admin).
 * Lecture/écriture via Supabase si configuré, sinon JSON local (dev).
 */

export const dynamic = "force-dynamic";

async function guard(): Promise<NextResponse | null> {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "Admin désactivé : définissez ADMIN_PASSWORD sur le serveur." },
      { status: 403 }
    );
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const data = await getPortfolio();
  return NextResponse.json({
    data,
    meta: {
      passwordConfigured: passwordConfigured(),
      supabaseConnected: Boolean(getSupabase()),
      supabaseError: supabaseConfigError(),
    },
  });
}

const REQUIRED_KEYS = [
  "profile",
  "skillGroups",
  "projects",
  "timeline",
  "languages",
  "interests",
] as const;

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    REQUIRED_KEYS.some((key) => !(key in body))
  ) {
    return NextResponse.json(
      { error: `Structure invalide : clés attendues — ${REQUIRED_KEYS.join(", ")}.` },
      { status: 400 }
    );
  }

  try {
    await savePortfolio(body as Parameters<typeof savePortfolio>[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur d'enregistrement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Republie la page d'accueil immédiatement.
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
