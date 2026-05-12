# TTC Berkum e. V. — Webseite

Vereinswebsite des [TTC Berkum 1954 e. V.](https://ttc-berkum.pages.dev) — Tischtennis in Peine. Migriert von Joomla zu **Astro**, statisch gebaut, deployed auf **Cloudflare Pages**.

## Schnellstart

```bash
npm install
npm run dev          # → http://localhost:4321
npm run build        # → dist/
```

Mit echtem Vereins-Kalender lokal testen (sonst zeigt /termine den Fallback-Hinweis):

```bash
GOOGLE_CALENDAR_ICAL_URL="https://calendar.google.com/calendar/ical/.../basic.ics" npm run dev
```

## Wo finde ich was?

| Aufgabe | Pfad |
|---|---|
| **Termine pflegen** | [docs/termine-pflegen.md](docs/termine-pflegen.md) – Google-Kalender-App, kein Code |
| **News-Beitrag** | [docs/news-pflegen.md](docs/news-pflegen.md) – Pages CMS, vom Handy aus, kein Code |
| **Neue Kelle-Ausgabe** | `public/pdfs/kellen/Kelle <Nr> <Jahr>.pdf` (wird automatisch sortiert) |
| **Vorstandsdaten** | `src/pages/ueber-uns.astro` (Vorstands-Cards) |
| **Trainingsplan** | `src/pages/trainingszeiten.astro` (Schedule-Array oben) |
| **Vollständige Projekt-Doku** | [docs/projekt-status.md](docs/projekt-status.md) |

## Wichtige Konventionen

- **Brand-Rot:** `#c8102e` (CSS-Variable `--color-primary`)
- **Schriften:** **Anton** (Headlines) + **Dosis** (Body)
- **Astro:** statischer Build (`output: 'static'`), **kein** Cloudflare-Adapter
- **Termin-Konvention:** Titel im Google-Kalender mit Präfix in eckigen Klammern → wird zu Kategorie-Tag, z. B. `[Punktspiel] Berkum I – Edemissen`
- **Scroll-Reveal:** Klasse `.reveal` blendet beim Sichtbarwerden ein (IntersectionObserver im BaseLayout); per Inline-Style `--delay: 200ms` staffeln
- **Dark Mode:** in-memory `data-theme="dark"` am `<html>` (kein localStorage)

## Wartungs-Automation

| Workflow | Wann | Was |
|---|---|---|
| `.github/workflows/scheduled-rebuild.yml` | alle 4 h | Cloudflare-Build-Hook triggern (frische Kalender-Daten) |

Manuell auslösbar: GitHub → Actions → „Run workflow".

## Deployment

- **Hosting:** Cloudflare Pages, Account `ttcberkum@gmail.com`
- **Repo:** [github.com/ttcberkum/webseite](https://github.com/ttcberkum/webseite)
- **Live:** [ttc-berkum.pages.dev](https://ttc-berkum.pages.dev) (eigene Domain `ttc-berkum.de` folgt)
- **Env-Variable (in Cloudflare):** `GOOGLE_CALENDAR_ICAL_URL` (Production, Secret)
- **GitHub-Secret:** `CLOUDFLARE_DEPLOY_HOOK` (für scheduled-rebuild)

Push auf `main` → automatischer Build & Deploy.

## Lizenz / Urheber

Inhalte © TTC Berkum 1954 e. V. — Code-Setup: Astro Starter-Template (MIT).
