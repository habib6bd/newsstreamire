import { NextResponse } from "next/server";

const UPSTREAM = "https://dpi-news.vercel.app/api/news/";

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { cache: "no-store" });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch upstream API", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ forward auth header (Bearer token) if sent from client
    const auth = req.headers.get("authorization") || "";

    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to post upstream API", details: err?.message },
      { status: 500 }
    );
  }
}
