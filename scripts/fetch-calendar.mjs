/**
 * Laedt den Vereins-iCal-Feed, expandiert wiederkehrende Termine
 * und schreibt das Ergebnis nach src/data/calendar-cache.json.
 *
 * Aufruf:
 *   GOOGLE_CALENDAR_ICAL_URL="https://..." node scripts/fetch-calendar.mjs
 *
 * Wird vom GitHub Workflow scheduled-rebuild.yml ausgefuehrt.
 */
import ical from 'node-ical';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, '..', 'src', 'data', 'calendar-cache.json');
const HORIZON_DAYS = 365;
const PREFIX_RE = /^\s*\[([^\]]+)\]\s*/;

function parseCategory(rawTitle) {
	const m = rawTitle.match(PREFIX_RE);
	if (!m) return { title: rawTitle.trim() };
	return {
		title: rawTitle.replace(PREFIX_RE, '').trim(),
		category: m[1].trim(),
	};
}

function makeEvent(ev, occurrence) {
	const start = occurrence ?? ev.start;
	let end;
	if (ev.end) {
		const duration = ev.end.getTime() - ev.start.getTime();
		end = new Date(start.getTime() + duration);
	}
	const { title, category } = parseCategory(String(ev.summary ?? ''));
	return {
		uid: `${ev.uid}-${start.getTime()}`,
		title: title || '(ohne Titel)',
		start: start.toISOString(),
		end: end ? end.toISOString() : undefined,
		allDay: !!ev.start.dateOnly,
		location: ev.location ? String(ev.location).trim() : undefined,
		description: ev.description ? String(ev.description).trim() : undefined,
		category,
		url: ev.url ? String(ev.url) : undefined,
	};
}

function expandRecurring(data, horizonDays) {
	const now = new Date();
	const min = new Date(now.getTime() - 365 * 24 * 3600 * 1000);
	const max = new Date(now.getTime() + horizonDays * 24 * 3600 * 1000);
	const out = [];

	for (const key of Object.keys(data)) {
		const item = data[key];
		if (!item || item.type !== 'VEVENT') continue;
		const ev = item;
		if (ev.rrule) {
			const dates = ev.rrule.between(min, max, true);
			const exdates = ev.exdate ?? {};
			for (const date of dates) {
				const k = date.toISOString().slice(0, 10);
				if (Object.values(exdates).some((d) => d.toISOString().slice(0, 10) === k)) continue;
				out.push(makeEvent(ev, date));
			}
		} else {
			if (ev.start >= min && ev.start <= max) out.push(makeEvent(ev));
		}
	}
	return out;
}

async function main() {
	const feed = process.env.GOOGLE_CALENDAR_ICAL_URL;
	if (!feed) {
		console.error('GOOGLE_CALENDAR_ICAL_URL nicht gesetzt – Skript abbrechen.');
		process.exit(1);
	}
	console.log('Lade Feed...');
	const data = await ical.async.fromURL(feed);
	const events = expandRecurring(data, HORIZON_DAYS);
	events.sort((a, b) => a.start.localeCompare(b.start));
	const cache = { fetchedAt: new Date().toISOString(), events };
	await writeFile(OUT, JSON.stringify(cache, null, 2) + '\n', 'utf8');
	console.log(`OK ${events.length} Termine nach ${OUT} geschrieben.`);
}

main().catch((err) => {
	console.error('Feed-Abruf fehlgeschlagen:', err?.message ?? err);
	process.exit(1);
});
