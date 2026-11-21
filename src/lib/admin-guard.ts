import { NextResponse } from "next/server";
import { adminEnabled, isAuthenticated } from "@/lib/auth";

/**
 * Contrôle d'accès commun aux routes API de l'admin.
 * Retourne une réponse d'erreur à renvoyer telle quelle, ou null si l'accès est autorisé.
 */
export async function adminGuard(): Promise<NextResponse | null> {
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
