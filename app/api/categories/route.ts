import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://dpi-news.vercel.app/api/categories/", {
      cache: "no-store",
    });

    const data = await res.json().catch(() => ([]));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch categories", details: err?.message },
      { status: 500 }
    );
  }
}
