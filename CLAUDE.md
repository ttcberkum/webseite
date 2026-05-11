# TTC Berkum e. V. – Webseite

Vereinswebsite des TTC Berkum (Peine), migriert von Joomla zu **Astro**. Statisch gebaut, automatisch via **Cloudflare Pages** deployed.

> **Vollständige Projekt-Doku, alle Zugänge und Setup-Schritte:** [docs/projekt-status.md](docs/projekt-status.md)

## Eckdaten

- **Live:** [ttc-berkum.pages.dev](https://ttc-berkum.pages.dev) (eigene Domain folgt)
- **Repo:** [github.com/ttcberkum/webseite](https://github.com/ttcberkum/webseite) (Branch: `main`)
- **Framework:** Astro v5+, statischer Build (`output: 'static'`)
- **Hosting:** Cloudflare Pages (Account: `ttcberkum@gmail.com`)
- **Termine:** Google-Kalender per iCal-Feed (Env: `GOOGLE_CALENDAR_ICAL_URL`)
- **Auto-Deploy:** Cron jede 4 h via GitHub Action `.github/workflows/scheduled-rebuild.yml`

## Branding

- **Primärfarbe:** `#c8102e` (klassisches Vereinsrot, nicht großflächig — nur als Akzent)
- **Schriften:** **Anton** (Headlines, Display) + **Dosis** (Body)
- **Logo + Hero-Bild:** Original aus dem alten Joomla-Auftritt unter `public/images/`

## Seitenstruktur

| Pfad | Inhalt |
| :--- | :--- |
| `/` | Hero, Highlights, Bild-Slider, Trainingsplan, Aktuelles & Termine |
| `/aktuelle-saison` | Click-TT/myTischtennis-Links (Verein-ID `1130350`) |
| `/mitglied-werden` | spg-direkt.de Online-Anmeldungs-iframe |
| `/trainingszeiten` | Mo/Fr 17:00–22:00 + Sa Kader, Sporthalle Rosenthal |
| `/termine` | Google-Kalender, gruppiert nach Monat + Archiv-Toggle |
| `/news` | Markdown Content Collection |
| `/kelle` | PDF-Archiv der Vereinszeitschrift (`public/pdfs/kellen/`) |
| `/spielregeln` | Vollständiges Regelwerk (5 Abschnitte) |
| `/vorgaberechner` | TTR-Vorgaberechner (clientseitig) |
| `/storchencam` | Live-Bild (60 s Refresh) + 24-Slot-Stunden-Archiv |
| `/ueber-uns` | Vereinsgeschichte, Vorstand, Slider |
| `/kontakt` | Kontaktdaten, Anfahrtshinweis |
| `/impressum`, `/datenschutz` | Rechtliches |

## Technische Konventionen

- **Dark Mode:** in-memory `data-theme="dark"` am `<html>`, kein `localStorage`
- **Scroll-Reveal:** Klasse `.reveal` + IntersectionObserver im BaseLayout — Animation mit `--delay: <ms>` per Inline-Style
- **Slider:** wiederverwendbare Komponente `src/components/ImageSlider.astro`
- **Saison-URL:** automatisch aus Datum berechnet, `src/lib/season.ts`
- **Termin-Convention:** Titel-Präfix in eckigen Klammern → Kategorie, z. B. `[Punktspiel] …`, `[Event] …`

## Wartung

- **Termine pflegen:** Google-Kalender-App, Anleitung in [docs/termine-pflegen.md](docs/termine-pflegen.md)
- **News:** Markdown-Datei in `src/content/news/` (Schema: `title`, `date`, `description?`)
- **Kelle:** PDF nach `public/pdfs/kellen/` (Namens-Schema: `Kelle <Nr> <Jahr>.pdf`)
- **Sofort-Build auslösen:** GitHub Actions → „Scheduled Rebuild" → „Run workflow"

## Entwicklungs-Befehle

```bash
npm install                 # einmalig
npm run dev                 # localhost:4321
npm run build               # Produktions-Build → dist/
npm run preview             # Build-Vorschau

# Mit echtem Kalender-Feed lokal testen:
GOOGLE_CALENDAR_ICAL_URL="https://calendar.google.com/calendar/ical/.../basic.ics" npm run dev
```

## Git-Identität für dieses Repo

Lokal konfiguriert auf `TTC Berkum <ttcberkum@gmail.com>`. Andere Repos auf demselben Rechner bleiben unter persönlicher Identität.
