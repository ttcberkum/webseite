// Cloudflare Pages Function – löst den Cloudflare-Deploy-Hook aus, damit frisch
// eingetragene Kalender-Termine sofort neu gebaut werden (statt bis zu 4 h zu warten).
// Die Hook-URL bleibt serverseitig (Env-Var), wird NIE an den Browser gegeben.
//
// Einmaliges Setup: Cloudflare → Pages "ttc-berkum" → Settings → Variables and Secrets
//   CLOUDFLARE_DEPLOY_HOOK = <dieselbe Deploy-Hook-URL wie im GitHub-Secret>

export async function onRequestPost({ env }) {
	const hook = env.CLOUDFLARE_DEPLOY_HOOK;
	if (!hook) {
		return Response.json(
			{ ok: false, error: 'CLOUDFLARE_DEPLOY_HOOK ist nicht gesetzt.' },
			{ status: 500 },
		);
	}
	try {
		const res = await fetch(hook, { method: 'POST' });
		return Response.json({ ok: res.ok, status: res.status }, { status: res.ok ? 200 : 502 });
	} catch (err) {
		return Response.json({ ok: false, error: String(err) }, { status: 502 });
	}
}

// Nur POST erlauben – ein versehentlicher GET-Aufruf soll keinen Build triggern.
export async function onRequestGet() {
	return new Response('Method Not Allowed', { status: 405 });
}
