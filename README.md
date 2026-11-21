# Portfolio — Fortune Assouan

Site vitrine freelance : consultant Power BI & data analyst. Identité
éditoriale sombre (Anton + Poppins, noir / crème), études de cas détaillées,
formulaire de contact réel et panneau d'administration en ligne.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript, Tailwind CSS v4
- Motion (paquet `framer-motion`) chargé en différé (`LazyMotion`), animations
  d'entrée du hero en CSS pur
- Supabase : contenu éditable (JSONB), images, messages du formulaire
- Resend (optionnel) : notification e-mail des messages
- Session admin par cookie HttpOnly signé (HMAC)

## Démarrage local

```bash
npm install
npm run dev        # http://localhost:3000  (admin : /admin)
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # build de production
```

En local **sans** Supabase, le site lit/écrit `src/data/portfolio.json` et
l'admin est ouvert sans mot de passe (machine locale uniquement). Le
formulaire de contact répond alors « pas encore activé » : il ne simule
jamais d'envoi.

## Où vit le contenu ?

| Contenu | Où le modifier |
| --- | --- |
| Profil, textes du hero, bio, compétences, projets, parcours, langues | `/admin` (Supabase) — valeurs par défaut dans `src/data/portfolio.json` |
| Services, méthode, navigation, textes de contact | `src/content/site.ts` |
| Études de cas (`/realisations/...`) | `src/content/case-studies.ts` + captures dans `public/realisations/` |
| Durées / courbes d'animation | `src/lib/motion.ts` (et variables CSS dans `globals.css`) |

Règle des études de cas : aucun chiffre qui ne figure pas dans les README
ou dashboards des dépôts GitHub ; chaque bloc de chiffres cite sa source.

Un projet de l'admin dont le lien GitHub (ou le titre) correspond à une étude
de cas est présenté par l'étude ; les autres apparaissent dans « Autres travaux ».

## Formulaire de contact

Deux canaux indépendants ; il en faut au moins un. Un message est accepté
dès qu'un canal réussit.

1. **Supabase** (messages lisibles dans `/admin` → Messages) : exécuter la
   partie « 3) Messages du formulaire de contact » de
   [`supabase/schema.sql`](supabase/schema.sql) dans le SQL Editor.
2. **Resend** (notification e-mail) : créer un compte sur
   [resend.com](https://resend.com), une clé API, puis sur Vercel :
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` — sans domaine vérifié, l'expéditeur de test
     `onboarding@resend.dev` ne peut écrire **qu'à l'adresse du compte Resend**
   - `RESEND_FROM` (optionnel, seulement avec un domaine vérifié)

Anti-spam : champ piège invisible + 5 envois max par IP et par 10 minutes.

## Mise en production (Vercel + Supabase)

Variables d'environnement (Vercel → Settings → Environment Variables) :

| Variable | Rôle |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` (serveur uniquement) |
| `ADMIN_PASSWORD` | mot de passe de `/admin` |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | notification e-mail (optionnel) |

Un `git push` sur `main` déclenche le déploiement Vercel.

### Mot de passe admin oublié ?

C'est la variable `ADMIN_PASSWORD` sur Vercel : l'icône œil la révèle, **Edit**
en définit une nouvelle, puis **Deployments → ⋯ → Redeploy**.

## Synchroniser le contenu avec le repo

```bash
npm run content:pull   # site en ligne  →  src/data/portfolio.json
npm run content:push   # src/data/portfolio.json  →  site en ligne
```

(les deux demandent le mot de passe admin)
