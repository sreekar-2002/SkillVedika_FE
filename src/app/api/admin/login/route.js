const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(req) {
	try {
		const body = await req.json();
		const incomingCookie = req.headers.get("cookie") || "";
		const incomingAuth = req.headers.get('authorization') || req.headers.get('Authorization') || '';

		const target = BACKEND_URL.replace('/api', '') + "/api/admin/login";
		if (process.env.NODE_ENV !== 'production') {
			console.log('[proxy admin login POST] target=', target, 'incomingCookie length=', incomingCookie.length, 'authPreview=', incomingAuth ? incomingAuth.substring(0,20) : '', 'bodyPreview=', JSON.stringify(body).substring(0,200));
		}

		const res = await fetch(target, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...(incomingCookie ? { cookie: incomingCookie } : {}),
				...(incomingAuth ? { Authorization: incomingAuth } : {}),
			},
			body: JSON.stringify(body),
		});

		const text = await res.text();
		try { return new Response(JSON.stringify(JSON.parse(text)), { status: res.status }); } catch { return new Response(text, { status: res.status }); }
	} catch (e) {
		console.error('admin login POST proxy error (target=' + (typeof target !== 'undefined' ? target : BACKEND_URL) + ')', e);
		const errMessage = e && e.message ? e.message : 'Unknown error';
		return new Response(JSON.stringify({ message: 'Failed to contact backend', backend: (typeof target !== 'undefined' ? target : BACKEND_URL), error: errMessage }), { status: 502 });
	}
}

export async function GET(req) {
	// Optional: proxy for GET if needed
	try {
		const incomingCookie = req.headers.get("cookie") || "";
		const target = BACKEND_URL.replace('/api', '') + "/api/admin/login";
		if (process.env.NODE_ENV !== 'production') console.log('[proxy admin login GET] target=', target);
		const res = await fetch(target, { method: 'GET', headers: { Accept: 'application/json', ...(incomingCookie ? { cookie: incomingCookie } : {}) } });
		const text = await res.text();
		try { return new Response(JSON.stringify(JSON.parse(text)), { status: res.status }); } catch { return new Response(text, { status: res.status }); }
	} catch (e) {
		console.error('admin login GET proxy error', e);
		return new Response(JSON.stringify({ message: 'Failed to contact backend' }), { status: 502 });
	}
}
