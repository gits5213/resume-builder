import { NextRequest, NextResponse } from "next/server";

const COUNTAPI_BASE = "https://countapi.mileshilliard.com/api/v1";

/**
 * Proxy to CountAPI in development so the same API is called via the dev server
 * and we avoid CORS/DNS issues. Not used in production (static export).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathSegments } = await params;
  if (!pathSegments?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  const path = pathSegments.join("/");
  const url = `${COUNTAPI_BASE}/${path}`;
  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy error" },
      { status: 502 }
    );
  }
}
