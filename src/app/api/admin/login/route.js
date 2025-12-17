const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(req) {
  try {
    const body = await req.json();

    const incomingCookie = req.headers.get("cookie") || "";
    const incomingAuth = req.headers.get("authorization") || req.headers.get("Authorization") || "";

    const res = await fetch(BACKEND_URL.replace("/api", "") + "/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(incomingAuth ? { Authorization: incomingAuth } : {}),
        ...(incomingCookie ? { cookie: incomingCookie } : {}),
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const setCookie = res.headers.get("set-cookie");
    const text = await res.text();

    const responseInit = { status: res.status, headers: {} };
    if (setCookie) responseInit.headers["set-cookie"] = setCookie;

    try {
      if (text && text.length > 0) {
        const data = JSON.parse(text);
        return new Response(JSON.stringify(data), responseInit);
      }
      return new Response(null, responseInit);
    } catch {
      return new Response(text || null, responseInit);
    }
  } catch (e) {
    console.error("login proxy error:", e);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
