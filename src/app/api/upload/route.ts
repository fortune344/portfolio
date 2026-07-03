import { NextResponse } from "next/server";
import { adminEnabled, isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/portfolio-store";

/** Upload d'une image de projet (protégé par session admin). */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "Admin désactivé : définissez ADMIN_PASSWORD sur le serveur." },
      { status: 403 }
    );
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const entry = form.get("file");
    file = entry instanceof File ? entry : null;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur d'upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
