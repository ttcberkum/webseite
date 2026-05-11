/**
 * Lädt Vereinstermine aus einem öffentlichen Google-Kalender (iCal-Feed).
 * Wird beim Astro-Build aufgerufen, expandiert wiederkehrende Termine und
 * teilt sie in `upcoming` / `past` auf.
 *
 * Konvention: Optionales Präfix in eckigen Klammern im Titel,
 * z. B. "[Punktspiel] Berkum I – Edemissen" → category = "Punktspiel"
 */
import ical, { type VEvent } from 'node-ical';

export type ClubEvent = {
	uid: string;
	title: string;
	start: Date;
	end?: Date;
	allDay: boolean;
	location?: string;
	description?: string;
	category?: string;
	url?: string;
};

const HORIZON_DAYS = 365;
const PREFIX_RE = /^\s*\[([^\]]+)\]\s*/;

function parseCategory(rawTitle: string): { title: string; category?: string } {
	const m = rawTitle.match(PREFIX_RE);
	if (!m) return { title: rawTitle.trim() };
	return {
		title: rawTitle.replace(PREFIX_RE, '').trim(),
		category: m[1].trim(),
	};
}

function isAllDay(ev: VEvent): boolean {
	const start = ev.start as Date & { dateOnly?: boolean };
	return !!start.dateOnly;
}

function makeEvent(ev: VEvent, occurrence?: Date): ClubEvent {
	const start = occurrence ?? (ev.start as Date);
	let end: Date | undefined;
	if (ev.end) {
		const duration = (ev.end as Date).getTime() - (ev.start as Date).getTime();
		end = new Date(start.getTime() + duration);
	}
	const { title, category } = parseCategory(String(ev.summary ?? ''));
	return {
		uid: `${ev.uid}-${start.getTime()}`,
		title: title || '(ohne Titel)',
		start,
		end,
		allDay: isAllDay(ev),
		location: ev.location ? String(ev.location).trim() : undefined,
		description: ev.description ? String(ev.description).trim() : undefined,
		category,
		url: (ev as any).url ? String((ev as any).url) : undefined,
	};
}

function expandRecurring(data: ical.CalendarResponse, horizonDays: number): ClubEvent[] {
	const now = new Date();
	const min = new Date(now.getTime() - 365 * 24 * 3600 * 1000); // 1 Jahr in die Vergangenheit (für Archiv)
	const max = new Date(now.getTime() + horizonDays * 24 * 3600 * 1000);
	const out: ClubEvent[] = [];

	for (const key of Object.keys(data)) {
		const item = data[key];
		if (!item || item.type !== 'VEVENT') continue;
		const ev = item as VEvent;

		if (ev.rrule) {
			// Wiederkehrend: zwischen min und max alle Vorkommen holen
			const dates = (ev.rrule as any).between(min, max, true) as Date[];
			const exdates = (ev.exdate ?? {}) as Record<string, Date>;
			for (const date of dates) {
				const key = date.toISOString().slice(0, 10);
				if (exdates && Object.values(exdates).some((d) => (d as Date).toISOString().slice(0, 10) === key)) continue;
				out.push(makeEvent(ev, date));
			}
		} else {
			const start = ev.start as Date;
			if (start >= min && start <= max) out.push(makeEvent(ev));
		}
	}

	return out;
}

export async function loadCalendar(): Promise<{ upcoming: ClubEvent[]; past: ClubEvent[]; ok: boolean }> {
	const feed = import.meta.env.GOOGLE_CALENDAR_ICAL_URL ?? process.env.GOOGLE_CALENDAR_ICAL_URL;
	if (!feed) {
		console.warn('[calendar] GOOGLE_CALENDAR_ICAL_URL nicht gesetzt – keine Termine verfügbar.');
		return { upcoming: [], past: [], ok: false };
	}
	try {
		const data = await ical.async.fromURL(feed);
		const events = expandRecurring(data, HORIZON_DAYS);
		const now = Date.now();
		const upcoming = events.filter((e) => +e.start >= now).sort((a, b) => +a.start - +b.start);
		const past = events.filter((e) => +e.start < now).sort((a, b) => +b.start - +a.start);
		return { upcoming, past, ok: true };
	} catch (err) {
		console.warn('[calendar] Feed nicht erreichbar – Termine werden leer angezeigt:', err);
		return { upcoming: [], past: [], ok: false };
	}
}

/** Hilfsfunktion: Termine nach Monat gruppieren (für die Termine-Seite). */
export function groupByMonth(events: ClubEvent[]): { key: string; label: string; events: ClubEvent[] }[] {
	const groups = new Map<string, ClubEvent[]>();
	const fmt = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });
	for (const ev of events) {
		const key = `${ev.start.getFullYear()}-${String(ev.start.getMonth() + 1).padStart(2, '0')}`;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(ev);
	}
	return Array.from(groups.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, events]) => ({
			key,
			label: fmt.format(events[0].start),
			events,
		}));
}

/** Macht aus einer https://...-iCal-URL eine webcal://-URL zum Abonnieren. */
export function toWebcalUrl(httpsUrl: string): string {
	return httpsUrl.replace(/^https?:\/\//i, 'webcal://');
}

/** Baut einen .ics-Inhalt für einen einzelnen Termin (Download-Button). */
export function eventToIcs(ev: ClubEvent, siteUrl: string = 'https://ttc-berkum.de'): string {
	const fmt = (d: Date) =>
		d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//TTC Berkum//Astro Site//DE',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'BEGIN:VEVENT',
		`UID:${ev.uid}@ttc-berkum.de`,
		`DTSTAMP:${fmt(new Date())}`,
		`DTSTART:${fmt(ev.start)}`,
		ev.end ? `DTEND:${fmt(ev.end)}` : '',
		`SUMMARY:${ev.category ? `[${ev.category}] ` : ''}${ev.title}`,
		ev.location ? `LOCATION:${ev.location}` : '',
		ev.description ? `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}` : '',
		`URL:${siteUrl}/termine`,
		'END:VEVENT',
		'END:VCALENDAR',
	].filter(Boolean);
	return lines.join('\r\n');
}
