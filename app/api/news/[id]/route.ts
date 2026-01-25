import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // ✅ Extract id from the request URL: /api/news/53
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1]; // last segment

    if (!id) {
      return NextResponse.json({ error: "Missing id in URL" }, { status: 400 });
    }

    const cleanId = id.replace(/\/+$/, "");

    const res = await fetch(`https://dpi-news.vercel.app/api/news/${cleanId}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch upstream API", details: err?.message },
      { status: 500 }
    );
  }
}
