/**
 * Tischtennis-Saison läuft von August (Jahr N) bis Juli (Jahr N+1).
 * Diese Helper-Funktion ermittelt aus dem aktuellen Datum automatisch
 * die laufende Saison – inkl. URL-Slug im myTischtennis-Format ("25--26").
 */
export function getCurrentSeason(now: Date = new Date()) {
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const startYear = month >= 8 ? year : year - 1;
	const endYear = startYear + 1;
	const slug = `${String(startYear).slice(2)}--${String(endYear).slice(2)}`;
	return { startYear, endYear, slug };
}
