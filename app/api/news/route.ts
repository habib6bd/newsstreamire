import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://dpi-news.vercel.app/api/news/", {
      method: "GET",
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
