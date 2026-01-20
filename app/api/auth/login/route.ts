import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { message: "API_BASE_URL is not set" },
        { status: 500 }
      );
    }

    // If your backend requires trailing slash, change to `${baseUrl}/auth/jwt/create/`
    const upstream = await fetch(`${baseUrl}/auth/jwt/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const access = data?.access;
    const refresh = data?.refresh;

    if (!access) {
      return NextResponse.json(
        { message: "No access token returned from API" },
        { status: 502 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ ok: true });

    response.cookies.set("access", access, {
      httpOnly: true,
      secure: isProd, // don't force secure on localhost
      sameSite: "lax",
      path: "/"
    });

    if (refresh) {
      response.cookies.set("refresh", refresh, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/"
      });
    }

    return response;
  } catch {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}