import { NextResponse } from "next/server";

const UPSTREAM_BASE = "https://dpi-news.vercel.app/api/news";

/**
 * Next 15+ sometimes provides params as a Promise.
 * This helper safely unwraps params for both old + new Next versions.
 */
async function getId(
  ctx:
    | { params: { id: string } }
    | { params: Promise<{ id: string }> }
    | any
): Promise<string | null> {
  try {
    const p = ctx?.params;
    const params = typeof p?.then === "function" ? await p : p;
    const id = params?.id ? String(params.id) : null;
    return id ? id.replace(/\/+$/, "") : null;
  } catch {
    return null;
  }
}

function buildHeaders(req: Request): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Forward Bearer token if client sends it to this proxy route
  const auth = req.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  return headers;
}

async function readJsonOrText(res: Response): Promise<any | null> {
  // Many APIs return empty body for DELETE/PUT success, so read text safely.
  const text = await res.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // If upstream returns plain text, still return something readable.
    return { message: text };
  }
}

/**
 * GET /api/news/:id  ->  GET https://dpi-news.vercel.app/api/news/:id/
 */
export async function GET(req: Request, ctx: any) {
  try {
    const id = await getId(ctx);

    if (!id) {
      return NextResponse.json({ error: "Missing id param" }, { status: 400 });
    }

    const res = await fetch(`${UPSTREAM_BASE}/${id}/`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await readJsonOrText(res);

    // If upstream returns 204 or empty body
    if (data === null) return new NextResponse(null, { status: res.status });

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch upstream API", details: err?.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/news/:id  ->  PUT https://dpi-news.vercel.app/api/news/:id/
 * Body is forwarded as JSON.
 */
export async function PUT(req: Request, ctx: any) {
  try {
    const id = await getId(ctx);

    if (!id) {
      return NextResponse.json({ error: "Missing id param" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    const res = await fetch(`${UPSTREAM_BASE}/${id}/`, {
      method: "PUT",
      headers: buildHeaders(req),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Some APIs return 204 on update
    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await readJsonOrText(res);
    if (data === null) return new NextResponse(null, { status: res.status });

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update upstream API", details: err?.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news/:id  ->  DELETE https://dpi-news.vercel.app/api/news/:id/
 * Fixes your issue: upstream may return 204 (no JSON).
 */
export async function DELETE(req: Request, ctx: any) {
  try {
    const id = await getId(ctx);

    if (!id) {
      return NextResponse.json({ error: "Missing id param" }, { status: 400 });
    }

    const res = await fetch(`${UPSTREAM_BASE}/${id}/`, {
      method: "DELETE",
      headers: buildHeaders(req),
      cache: "no-store",
    });

    // ✅ Success with no body is common for DELETE
    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await readJsonOrText(res);

    // If empty body but status isn't 204, still forward status cleanly
    if (data === null) return new NextResponse(null, { status: res.status });

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete upstream API", details: err?.message },
      { status: 500 }
    );
  }
}
