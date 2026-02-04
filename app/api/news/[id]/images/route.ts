import { NextResponse } from "next/server";

const API_BASE = "https://dpi-news.vercel.app/api";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[2]; // ["api","news",":id","images"]
    if (!id) return NextResponse.json({ error: "Missing news id" }, { status: 400 });

    const formData = await req.formData();
    const auth = req.headers.get("authorization") || "";

    const upstream = await fetch(`${API_BASE}/news/${id}/images/`, {
      method: "POST",
      headers: auth ? { Authorization: auth } : undefined,
      body: formData,
    });

    const text = await upstream.text();

    // ✅ Always return upstream response body (json or text)
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to upload image", details: err?.message },
      { status: 500 }
    );
  }
}
