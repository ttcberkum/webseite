# Projekt: TTC Berkum - Astro Migration

Dieses Projekt ist eine Migration der bestehenden Joomla-Webseite des TTC Berkum zu **Astro**. Der Fokus liegt auf Performance, Barrierefreiheit und einem modernen, reinen CSS-Design-System.

## Projektübersicht
- **Framework:** Astro (v5+)
- **Styling:** Reines CSS (Vanilla), Nexus Design System
- **Content:** Markdown-basierte Content Collections (News)
- **Deployment:** (Noch offen)

## Seitenstruktur (Sitemap)
- [x] **Startseite** (`/`) - Hero & Übersicht
- [ ] **Über uns** (`/ueber-uns`) - Vereinsgeschichte & Vorstand
- [ ] **Leistungen** (`/leistungen`) - Trainingszeiten & Angebote
- [ ] **News** (`/news`) - Archiv der Markdown-Artikel
- [ ] **Kontakt** (`/kontakt`) - Kontaktformular & Anfahrt
- [ ] **Impressum** (`/impressum`) - Rechtliches
- [ ] **Datenschutz** (`/datenschutz`) - Rechtliches

## Technische Hinweise
- **Dark Mode:** Implementiert als in-memory Variable (kein `localStorage` auf Wunsch des Nutzers). Das Farbschema wird über `data-theme="dark"` am `<html>`-Element gesteuert.
- **Legacy Links:** Die Migration der alten Joomla-URLs (Aliase) erfolgt in einem späteren Schritt über Astro-Redirects.
- **Design:** Nutzung von CSS Custom Properties für Farben und ein fluider Type Scale via `clamp()`.

## Status-Tabelle

| Seite | Status | Typ |
| :--- | :--- | :--- |
| Startseite | Erledigt | Astro Page |
| Layout (Base) | Erledigt | Astro Layout |
| Design System | Erledigt | CSS |
| News-Archiv | Ausstehend | Content Collection |
| Über uns | Ausstehend | Astro Page |
| Leistungen | Ausstehend | Astro Page |
| Kontakt | Ausstehend | Astro Page |

## Entwicklungs-Befehle
- `npm run dev` - Startet den lokalen Dev-Server
- `npm run build` - Erstellt den Produktions-Build
- `npm run preview` - Lokale Vorschau des Builds
