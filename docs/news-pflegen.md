# News pflegen — Kurzanleitung für Vorstand & Redaktion

News-Beiträge auf der Website (`/news` + Startseite) schreibst du bequem vom Handy oder Rechner über **Pages CMS** — ein kleiner Online-Editor, der die Beiträge direkt ins GitHub-Repo speichert. Kein YAML, keine Datei-Editiererei.

## Einmaliges Setup

1. Auf [pagescms.org](https://pagescms.org) gehen → **„Sign in with GitHub"**.
2. Mit dem **TTC-Berkum-GitHub-Konto** (`ttcberkum@gmail.com`) anmelden.
3. Bei der Authorisierung: **Only select repositories** → `ttcberkum/webseite` auswählen.
4. Fertig — das Repo erscheint in der Pages-CMS-Übersicht.

**Tipp:** Die Editor-URL auf dem Handy-Homescreen als Lesezeichen ablegen → ein Tap und du bist drin. Direkt-Link nach erstem Login:
`https://app.pagescms.org/ttcberkum/webseite`

## Neuen Beitrag schreiben

1. Pages CMS öffnen → Repo **„webseite"** → Collection **„News"**.
2. **„Neuer Eintrag"** (oben rechts).
3. Felder ausfüllen:
   - **Titel:** kurz und prägnant (z. B. „Saisonabschluss-Grillen")
   - **Datum:** ist mit heutigem Datum vorbelegt — bei Bedarf anpassen
   - **Kurzbeschreibung:** 1–2 Sätze, erscheinen als Anriss in der News-Übersicht
   - **Entwurf:** **NICHT** ankreuzen, wenn der Beitrag online soll
   - **Inhalt:** der eigentliche Text. Du kannst:
     - **fett** / *kursiv* / Listen über die Toolbar formatieren
     - mit dem **🖼️-Button Bilder hochladen** (Foto aus der Galerie wählen — wird automatisch ins Repo geladen)
     - Links einfügen
4. Oben rechts **„Save"** → der Beitrag wird ins GitHub-Repo committed.

## Wann ist der Beitrag online?

- **Automatisch:** Cloudflare Pages startet sofort einen neuen Build → ~1–2 Min später ist der Beitrag live.
- **Prüfen:** Cloudflare-Dashboard → Pages → `webseite` → Deployments (oder einfach `ttc-berkum.pages.dev/news` neu laden).

## Entwurf-Modus (Draft)

Wenn du erst mal speichern willst, ohne dass es jemand sieht:

- Häkchen bei **„Entwurf"** setzen → Beitrag wird gespeichert, erscheint aber **NICHT** auf der Live-Seite.
- Später Häkchen entfernen + Speichern → beim nächsten Build geht er live.

## Ablaufdatum

Manche Ankündigungen sollen nur bis zu einem bestimmten Datum auf der Startseite stehen (z. B. „Fahrradtour am 12.6." soll nach dem Termin nicht mehr unter „Aktuelles" zu sehen sein).

- Im Feld **„Ablaufdatum"** das gewünschte Datum eintragen.
- **Verhalten:** Nach diesem Tag verschwindet der Beitrag aus dem „Aktuelles"-Block auf der Startseite. Im News-Archiv unter `/news` bleibt er aber sichtbar.
- Wer kein Ablauf will, lässt das Feld einfach leer.

*Hinweis:* Da die Seite alle 4 h neu gebaut wird, kann es nach dem Stichtag noch ein paar Stunden dauern, bis der Beitrag wirklich von der Startseite verschwindet.

## Bild hochladen — was passiert?

- Pages CMS lädt das Bild nach `public/images/news/` im Repo.
- Im Beitrag wird automatisch der Link eingefügt (`/images/news/dein-foto.jpg`).
- **Tipp:** Vor dem Hochladen das Foto auf dem Handy etwas verkleinern (z. B. WhatsApp-Format oder mit der Foto-App auf max. 2000 px Breite) — das macht die Seite schneller.

## Titelbild für die Übersicht

Das Feld **„Titelbild"** ist optional, sehr empfehlenswert für Aufmerksamkeit:

- Erscheint als **Thumbnail** in der News-Übersicht (`/news`) und auf der **Startseite** unter „Aktuelles".
- Im Beitrag selbst wird das Titelbild **nicht** automatisch angezeigt — wenn du es auch im Text sehen willst, füge es zusätzlich im Inhalt ein.
- Format-Empfehlung: querformatig (z. B. 1200 × 800 px). Hochformat-Fotos werden zugeschnitten.
- Leer lassen → Beitrag erscheint in der Übersicht ohne Bild (so wie bisher).

## Beitrag bearbeiten oder löschen

- Im Pages CMS Collection „News" öffnen → Beitrag antippen.
- Änderungen vornehmen → **Save** = neuer Commit.
- Löschen: oben rechts **„Delete"** → entfernt den Beitrag aus dem Repo, beim nächsten Build verschwindet er online.

## Häufige Probleme

- **„Repository not found"** beim ersten Login: GitHub-App-Berechtigung prüfen — muss `ttcberkum/webseite` enthalten.
- **Bild zu groß / Upload langsam:** verkleinern (siehe oben), Pages CMS hat ein Limit von ~5 MB pro Datei.
- **Beitrag erscheint nicht:** Cloudflare-Build noch nicht durch (1–2 Min warten) oder „Entwurf" ist noch aktiv.
- **Versehentlich gelöscht:** im GitHub-Repo unter „History" findet sich der Beitrag — sag dem Webmaster Bescheid.

## Wer pflegt mit?

Wenn jemand Neues schreiben können soll:

1. Person hat einen **eigenen GitHub-Account**.
2. Im Repo `ttcberkum/webseite` → Settings → Collaborators → Person hinzufügen.
3. Person loggt sich bei Pages CMS ein und sieht das Repo dort.

Bei Fragen → Webmaster ansprechen.
