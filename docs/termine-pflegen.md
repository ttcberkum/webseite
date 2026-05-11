# Termine pflegen — Kurzanleitung für Vorstand & Redaktion

Die Vereinstermine auf der Website (Startseite + Seite **/termine**) kommen aus einem **gemeinsamen Google-Kalender**. Du pflegst Termine wie in deinem normalen Kalender — vom Handy, Tablet oder am Rechner.

## So legst du einen Termin an

1. **Google-Kalender-App öffnen** (auf dem Handy oder am Browser unter calendar.google.com).
2. Den Kalender **„TTC Berkum Termine"** auswählen (muss einmalig freigegeben sein — siehe unten).
3. Auf **`+`** tippen → **Termin**.
4. Titel eingeben — am besten mit Kategorie-Präfix in eckigen Klammern:
   - `[Punktspiel] Berkum I – Edemissen`
   - `[Verein] Jahreshauptversammlung`
   - `[Event] Fahrradtour`
   - `[Training] Kadertraining Jugend`
   - oder ohne Präfix (wird als „Allgemein" angezeigt)
5. **Datum/Uhrzeit** wählen (Datum-Picker).
6. Bei Bedarf **Ort** ergänzen (z. B. `Sporthalle Rosenthal, Pechschwarte 64`).
7. Optional eine **Beschreibung** schreiben.
8. Bei wiederkehrenden Terminen: **„Wiederholen"** auswählen (z. B. wöchentlich, monatlich).
9. **Speichern** → fertig.

## Wann erscheint der Termin online?

- **Automatisch:** alle 4 Stunden baut die Website neu und holt sich frische Daten.
- **Sofort:** über das **Deploy-Lesezeichen** auf deinem Handy-Homescreen.

## Sofort-Veröffentlichen via Lesezeichen

Wenn ein Termin schnell online muss:

1. Lesezeichen auf dem Handy antippen → ruft den Cloudflare-Pages-Deploy-Hook auf.
2. ~1 Minute Build-Zeit → Termin ist live.

Den Lesezeichen-Link bekommst du einmalig vom Webmaster. Alternativ:

- GitHub-App öffnen → Repository → Actions → **Scheduled Rebuild** → **„Run workflow"**.

## Kategorien

Aktuell werden alle Termine in Vereinsrot dargestellt. Die Kategorie aus dem Präfix (`[Punktspiel]`, `[Event]` …) erscheint als kleines Tag neben dem Termin. Wenn wir kategorie-spezifische Farben möchten, ist das eine kleine CSS-Anpassung.

## Tipp: Kalender abonnieren

Auf der Termine-Seite (`/termine`) gibt es oben einen **„In Kalender öffnen"**-Button. Damit landen alle Vereinstermine automatisch in deinem privaten Apple-/Google-/Outlook-Kalender. Updates erscheinen dort automatisch.

## Freigabe für neue Redakteur:innen

Im Google-Kalender (am Rechner einfacher):

1. „Mehr" (drei Punkte) neben **TTC Berkum Termine** → **Einstellungen und Freigabe**.
2. **Für bestimmte Personen freigeben** → E-Mail-Adresse hinzufügen.
3. Berechtigung **„Änderungen vornehmen"** wählen.
4. Speichern.

## Probleme?

- **Termin erscheint nicht:** Build noch nicht durch — bis zu 4 h, oder Lesezeichen drücken.
- **Termin ist falsch:** im Google-Kalender korrigieren, beim nächsten Build aktualisiert sich die Website.
- **Termin löschen:** im Google-Kalender löschen, beim nächsten Build verschwindet er auch online.

Bei technischen Problemen den Webmaster ansprechen.
