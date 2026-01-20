import { NextResponse } from "next/server";

const BASE_URL = "https://dpi-news.vercel.app/api/";

export async function POST(req: Request) {
  const body = await req.json();

  // 1) Signup: POST /users/ (public)
  const signupRes = await fetch(`${BASE_URL}users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name
    })
  });

  const signupData = await signupRes.json().catch(() => ({}));

  if (!signupRes.ok) {
    return NextResponse.json(signupData, { status: signupRes.status });
  }

  // 2) Auto-login: POST /auth/jwt/create/
  const loginRes = await fetch(`${BASE_URL}auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password })
  });

  const tokens = await loginRes.json().catch(() => ({}));

  if (!loginRes.ok) {
    // account created but login failed
    return NextResponse.json(
      { signup: signupData, login_error: tokens },
      { status: loginRes.status }
    );
  }

  const res = NextResponse.json({ ok: true, user: signupData });

  // Store JWT in httpOnly cookies (more secure than localStorage)
  res.cookies.set("access", tokens.access, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  res.cookies.set("refresh", tokens.refresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  return res;
}