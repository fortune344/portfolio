import { NextResponse } from "next/server";
import { adminEnabled, checkPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "Admin désactivé : définissez ADMIN_PASSWORD sur le serveur." },
      { status: 403 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
