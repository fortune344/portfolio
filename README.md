# Portfolio — Fortune Assouan

Portfolio personnel : Data Analyst & Développeur IT. Site éditorial sombre
(Next.js) avec panneau d'administration en ligne (Supabase + mot de passe).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 — Framer Motion — Lucide Icons
- Supabase (base de données JSONB + stockage des images)
- Session admin par cookie HttpOnly signé (HMAC)

## Démarrage local

```bash
npm install
npm run dev      # http://localhost:3000  (admin : /admin)
npm run build    # build de production
```

En local **sans** Supabase configuré, le site lit/écrit
`src/data/portfolio.json` et les images vont dans `public/uploads/` —
l'admin est ouvert sans mot de passe (machine locale uniquement).

## Administration

Ouvrir **`/admin`** : connexion par mot de passe, puis modification de tout le
contenu (profil, manifeste, bio, compétences, projets, parcours, langues).
Pour chaque projet : image uploadée (affichée dans le mockup laptop), lien
GitHub **et/ou** lien du site en ligne (les deux optionnels), tags, catégorie,
ordre, mise en avant. « Enregistrer » publie immédiatement (revalidation).

## Mise en production (Vercel + Supabase)

1. **Supabase** : créer un projet sur [supabase.com](https://supabase.com)
   (gratuit), ouvrir *SQL Editor* et exécuter le contenu de
   [`supabase/schema.sql`](supabase/schema.sql).
2. Récupérer dans *Settings → API* : l'URL du projet et la clé `service_role`.
3. **Vercel** : importer ce repo GitHub sur [vercel.com/new](https://vercel.com/new),
   puis dans *Settings → Environment Variables* ajouter :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (le mot de passe de ton admin)
4. Déployer. Ouvrir `https://ton-site.vercel.app/admin`, se connecter et
   cliquer « Enregistrer » une première fois pour copier les données par
   défaut dans Supabase. Ensuite, tout se gère en ligne.
5. Mettre à jour `siteUrl` dans `src/app/layout.tsx`, `src/app/sitemap.ts` et
   `src/app/robots.ts` avec l'URL définitive, puis pousser.

Sans ces variables, le site fonctionne quand même (contenu de
`src/data/portfolio.json`) mais l'admin en ligne est désactivé.

## Notes

- Avatar du hero : `public/avatar.svg` (illustration remplaçable).
- Les projets sans image affichent un aperçu dessiné en CSS
  (graphique, kanban, tableau ou terminal — au choix dans l'admin).
