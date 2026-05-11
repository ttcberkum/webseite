# TTC Berkum Webseite — Projekt-Status & Zugänge

> Versions-, Zugangs- und Wartungs-Doku. Wird mit jedem größeren Schritt aktualisiert.
> **Stand: 2026-05-11**

---

## 1. Was läuft wo?

### Live-Adressen

| Dienst | URL | Login |
| :--- | :--- | :--- |
| **Live-Seite** | [https://ttc-berkum.pages.dev](https://ttc-berkum.pages.dev) | (öffentlich) |
| **GitHub-Repo** | [https://github.com/ttcberkum/webseite](https://github.com/ttcberkum/webseite) | GitHub `ttcberkum` |
| **Cloudflare Pages** | [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → `ttc-berkum` | Cloudflare `ttcberkum@gmail.com` |
| **Google-Kalender** | [calendar.google.com](https://calendar.google.com) → „TTC Berkum Termine" | Google `ttcberkum@gmail.com` |
| **GitHub Actions** | [github.com/ttcberkum/webseite/actions](https://github.com/ttcberkum/webseite/actions) | GitHub `ttcberkum` |

### Wichtige Direkt-Links

| Aktion | URL |
| :--- | :--- |
| Sofort-Build auslösen | [github.com/ttcberkum/webseite/actions/workflows/scheduled-rebuild.yml](https://github.com/ttcberkum/webseite/actions/workflows/scheduled-rebuild.yml) → „Run workflow" |
| Storchencam-Snapshot manuell | [github.com/ttcberkum/webseite/actions/workflows/storchencam-snapshot.yml](https://github.com/ttcberkum/webseite/actions/workflows/storchencam-snapshot.yml) → „Run workflow" |
| Deployment-Übersicht (Cloudflare) | Workers & Pages → `ttc-berkum` → Deployments-Tab |
| Env-Variablen | Workers & Pages → `ttc-berkum` → Settings → Variables and Secrets |
| GitHub-Secrets | [github.com/ttcberkum/webseite/settings/secrets/actions](https://github.com/ttcberkum/webseite/settings/secrets/actions) |

---

## 2. Konten

| Konto | E-Mail / User | Wofür |
| :--- | :--- | :--- |
| **GitHub** | `ttcberkum` | Repo, Actions, Secrets |
| **Cloudflare** | `ttcberkum@gmail.com` | Pages-Hosting, Deploy-Hook |
| **Google** | `ttcberkum@gmail.com` | Vereinskalender |

**Hinweis:** Lokales Git ist in diesem Repo auf `TTC Berkum <ttcberkum@gmail.com>` konfiguriert. Frühere Commits (`b264092` und davor) sind unter „Erik Böker <boeker@bmpgmbh.de>" — das ist OK und entspricht der echten Migrationsarbeit.

---

## 3. Architektur

```
Google-Kalender ──(iCal-Feed)──┐
                               │
                               ▼
                    ┌─────────────────────┐
GitHub Repo ──(push)│  Cloudflare Pages   │── ttc-berkum.pages.dev
                    │  • Astro build      │
                    │  • static output    │
                    └─────────────────────┘
                               ▲
                               │
GitHub Action (Cron, alle 4 h) ┘
  └─ Deploy-Hook → forciert neuen Build
```

- **Astro v5+**, `output: 'static'`, **kein** Cloudflare-Adapter, **kein** SSR
- Cloudflare deployt das `dist/`-Verzeichnis als reine statische Files
- Termine werden **beim Build** aus dem iCal-Feed geladen — dadurch sehen alle Besucher denselben Stand
- Stündlicher Storchencam-Snapshot via GitHub Action (separater Workflow)

---

## 4. Env-Variablen & Secrets

### Cloudflare Pages → `ttc-berkum` → Settings → Variables and Secrets

| Name | Wert | Typ |
| :--- | :--- | :--- |
| `GOOGLE_CALENDAR_ICAL_URL` | `https://calendar.google.com/calendar/ical/.../basic.ics` | Secret (Production) |

### GitHub → `ttcberkum/webseite` → Settings → Secrets and variables → Actions

| Name | Wert | Wofür |
| :--- | :--- | :--- |
| `CLOUDFLARE_DEPLOY_HOOK` | `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<id>` | Cron-Workflow triggert neuen Build |

---

## 5. Wie ich etwas ändere

### Termin eintragen

→ Siehe ausführlich in [`docs/termine-pflegen.md`](termine-pflegen.md)

1. Google-Kalender-App → „TTC Berkum Termine" → `+` Termin
2. Titel mit Kategorie-Präfix, z. B. `[Punktspiel] Berkum I – Edemissen`
3. Speichern → erscheint innerhalb von 4 h online (oder Sofort-Build-Lesezeichen).

### News-Beitrag

1. In `src/content/news/` eine Markdown-Datei anlegen (Dateiname wird zur URL)
2. Frontmatter: `title`, `date`, optional `description`
3. Commit + Push → automatischer Re-Deploy

### Neue Kelle-Ausgabe

1. PDF nach `public/pdfs/kellen/` ablegen
2. Namens-Schema: `Kelle <Nummer> <Jahr>.pdf` (z. B. `Kelle 37 2025.pdf`)
3. Commit + Push → erscheint automatisch im Archiv, sortiert nach Nummer

### Vorstandsdaten ändern

→ [`src/pages/ueber-uns.astro`](../src/pages/ueber-uns.astro) anpassen

### Trainingszeiten ändern

→ [`src/pages/trainingszeiten.astro`](../src/pages/trainingszeiten.astro), oben im Frontmatter steht das Schedule-Array

### Sofort-Build auslösen

- **Browser:** GitHub Actions → „Scheduled Rebuild" → „Run workflow"
- **Lesezeichen-Variante:** in Browser-Lesezeichen URL hinterlegen, die auf den Cloudflare Deploy-Hook POST'et

---

## 6. Wartungs-Workflows

### `.github/workflows/storchencam-snapshot.yml`

- Läuft **stündlich** (`5 * * * *`)
- Lädt das aktuelle Storchencam-Bild von `berkum.lima-city.de`
- Speichert als `public/storchencam/<HH>.jpg` (UTC-Stunde, 24 Slots rollierend)
- Commit + Push (auto), löst dadurch Cloudflare-Rebuild aus

### `.github/workflows/scheduled-rebuild.yml`

- Läuft **alle 4 Stunden** (`0 */4 * * *`)
- Postet HTTP POST an `CLOUDFLARE_DEPLOY_HOOK`
- Cloudflare baut neu → frische Termine aus dem Kalender

Beide Workflows lassen sich manuell via „Run workflow"-Button auf GitHub triggern.

---

## 7. Was wir gemacht haben (Chronologie)

### Phase 1 — Migration & Inhalt
- Migration der Joomla-Inhalte (`ttc-berkum.de`) zu Astro
- Echte Inhalte: Vorstand, Adressen, Trainingszeiten (Mo/Fr 17–22 Uhr, Halle Rosenthal)
- Aktuelle-Saison-Seite mit Click-TT/myTischtennis-Links (Vereins-ID `1130350`)
- News: 3 Markdown-Beiträge übernommen (Fahrradtour, Neuanmeldungen, Neue Webseite)
- Spielregeln: vollständig (5 Abschnitte, ~38 Punkte) aus Original übernommen
- Mitglied werden: spg-direkt.de iframe aus Original übernommen

### Phase 2 — Design-Refactor
- Brand-Farben: Teal → Orange → **Vereinsrot `#c8102e`** (Logo-nah, dezent)
- Schriften: Outfit → **Anton** (Display) + **Dosis** (Body), wie Original
- Hero mit echtem Original-Hintergrundbild (`intro_bg.jpg`)
- Vereinslogo aus Joomla übernommen (`public/images/logo.svg`)
- Header dunkel, Footer schwarz, rote Akzente sparsam eingesetzt

### Phase 3 — Neue Features
- **Slider-Komponente** (`ImageSlider.astro`) mit Crossfade, Auto-Rotate, Pfeil-Navigation, Pause-on-Hover. Eingesetzt auf `/ueber-uns` und `/`
- **Storchencam-Seite** mit Live-Bild (60 s Refresh) + Stunden-Archiv (max 24 Slots, GitHub Action)
- **Kelle-Seite** mit dynamischem PDF-Listing (Featured + Archiv)
- **Impressum + Datenschutz** angelegt (Original-Joomla hatte nur leere Hülsen)
- **Scroll-Reveal** via IntersectionObserver, gestaffelte Delays

### Phase 4 — Termine via Google Calendar
- Neue Komponenten: `EventCard`, `UpcomingEvents`
- `src/lib/calendar.ts` mit `node-ical`, RRULE-Expansion, Kategorie-Parsing
- Termine-Seite mit Monatsgruppierung + Archiv-`<details>`
- Startseite umgebaut: 2-Spalten „Aktuelles & Termine"
- Header-Nav erweitert um „Termine"

### Phase 5 — Deployment
- Lokales Git-Repo angelegt, Identität auf TTC Berkum umgestellt
- GitHub-Repo unter `ttcberkum/webseite` (Branch `main`)
- Cloudflare Pages connected (nach erst-falschem Workers-Mode-Versuch)
- Env-Variable `GOOGLE_CALENDAR_ICAL_URL` gesetzt
- Cron-Workflow + Storchencam-Workflow aktiv
- Google-Kalender „TTC Berkum Termine" mit öffentlicher iCal-URL angelegt

---

## 8. Bekannte Issues / Offene Punkte

- **Eigene Domain** `ttc-berkum.de` noch nicht mit Cloudflare Pages verbunden (DNS-Setup erforderlich)
- **Altes `webseite`-Worker-Projekt** in Cloudflare kann gelöscht werden (Cosmetik)
- **News-Demo-Beiträge** (Fahrradtour 2025) — beim ersten echten neuen Beitrag prüfen, ob die Demo-Inhalte raus sollen
- **Datenschutzerklärung** ist eine schlanke Eigenfassung — sollte bei Erweiterung der Tools (Analytics, externe Embeds) angepasst werden
- **Impressum** Vertretungsberechtigter manuell setzen, falls sich der Vorstand ändert

---

## 9. Wichtige Dateien

```
src/
├── lib/
│   ├── calendar.ts          # Google-Kalender iCal-Reader, RRULE-Expansion
│   └── season.ts            # Automatische TTVN-Saison-URL aus Datum
├── components/
│   ├── ImageSlider.astro    # Wiederverwendbarer Slider
│   ├── EventCard.astro      # Termin-Karte
│   └── UpcomingEvents.astro # Termin-Widget für Startseite
├── content/
│   ├── news/                # Markdown-News-Beiträge
│   └── ...
├── pages/
│   ├── index.astro          # Startseite
│   ├── termine.astro        # Termine-Seite
│   ├── kelle.astro          # Vereinszeitschrift-Archiv
│   ├── storchencam.astro    # Live-Cam + Archiv
│   └── ...
├── layouts/
│   └── BaseLayout.astro     # Header, Footer, Scripts (Theme, Reveal, Slider)
└── styles/
    └── global.css           # Design-System, Brand-Tokens, Komponenten-Styles

public/
├── images/                  # Logos, Slider-Bilder, Hero-Bg
├── pdfs/kellen/             # Vereinszeitschriften
└── storchencam/             # Stunden-Snapshots (00.jpg–23.jpg)

.github/workflows/
├── storchencam-snapshot.yml # Stündlicher Cam-Snapshot
└── scheduled-rebuild.yml    # 4-stündlicher Rebuild

docs/
├── projekt-status.md        # diese Datei
└── termine-pflegen.md       # Anleitung für Vorstand
```

---

## 10. Wenn was nicht funktioniert

| Symptom | Wahrscheinliche Ursache | Lösung |
| :--- | :--- | :--- |
| Termine erscheinen nicht | Env-Variable in Cloudflare nicht gesetzt oder Build veraltet | Settings → Variables prüfen, dann „Retry deployment" |
| Build schlägt fehl | Syntax-Fehler in Astro-Datei | Cloudflare Build-Log lesen, lokal `npm run build` testen |
| Storchencam-Bilder veraltet | GitHub Action gestoppt | Actions-Tab → „Storchencam Snapshot" → letzten Run prüfen |
| Cron-Workflow rot | `CLOUDFLARE_DEPLOY_HOOK` ungültig/abgelaufen | In Cloudflare neuen Hook erstellen, GitHub-Secret aktualisieren |
| Sofort-Veröffentlichung will nicht | GitHub-Workflow gerade noch nicht durch | 1–2 Min warten, in Cloudflare Deployments-Tab schauen |

Für komplexere Probleme: in den **letzten Commits** schauen (`git log`) und ggf. einen `git revert` machen — das setzt automatisch einen neuen Deploy auf.
