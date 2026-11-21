import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-guard";
import { contactChannels, deleteMessage, listMessages, setMessageRead } from "@/lib/contact-store";

/** Boîte de réception de l'admin : messages du formulaire de contact (Supabase). */

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const channels = contactChannels();
  try {
    const messages = await listMessages();
    return NextResponse.json({ messages, channels });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur de lecture.";
    return NextResponse.json(
      {
        messages: [],
        channels,
        error: `Lecture impossible : ${message}. Vérifie que la table « contact_messages » existe (supabase/schema.sql).`,
      },
      { status: 200 }
    );
  }
}

async function readBody(request: Request): Promise<{ id?: unknown; read?: unknown }> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function PATCH(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id, read } = await readBody(request);
  if (typeof id !== "string" || typeof read !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }
  try {
    await setMessageRead(id, read);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await readBody(request);
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }
  try {
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}
