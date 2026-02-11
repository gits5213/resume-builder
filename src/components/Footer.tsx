"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

// Production: direct URL (browser talks to CountAPI from your live site, e.g. GitHub Pages).
// Dev: same API via Next.js proxy to avoid CORS/DNS issues.
const COUNTAPI_BASE = "https://countapi.mileshilliard.com/api/v1";
const COUNTAPI_KEY = "resume-builder-visits";
const STORAGE_KEY = "resume-builder-visit-count";
const SESSION_HIT_KEY = "resume-builder-visit-hit";

function getCachedCount(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached === null) return null;
    const n = parseInt(cached, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

function setCachedCount(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // ignore
  }
}

function getCountApiUrl(alreadyHit: boolean): string {
  const action = alreadyHit ? "get" : "hit";
  const isDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  if (isDev) {
    return `/api/countapi/${action}/${COUNTAPI_KEY}`;
  }
  return `${COUNTAPI_BASE}/${action}/${COUNTAPI_KEY}`;
}

/** Parse CountAPI response; mileshilliard returns value as string or number. */
function parseCountApiResponse(data: { value?: number | string }): number | null {
  const v = data?.value;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

export function Footer() {
  // Always start as null so server and client first render match (avoids hydration error).
  // Cached count is applied in useEffect after mount.
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const alreadyHit =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_HIT_KEY) === "1";
    const url = getCountApiUrl(alreadyHit);

    function applyCount(value: number | null) {
      if (value !== null) {
        setVisitCount(value);
        setCachedCount(value);
      }
      if (!alreadyHit && typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(SESSION_HIT_KEY, "1");
      }
    }

    // Show cached count immediately while we revalidate (client-only, no hydration issue).
    const cached = getCachedCount();
    if (cached !== null) setVisitCount(cached);

    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Not ok"))))
      .then((data) => {
        const value = parseCountApiResponse(data);
        if (value !== null) applyCount(value);
      })
      .catch(() => {
        setVisitCount((prev) => prev ?? getCachedCount());
      });
  }, []);

  return (
    <footer className="no-print mt-auto border-t border-border bg-muted/50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
          <p>
            Designed &amp; Developed by{" "}
            <a
              href="https://gitsics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground transition-colors hover:text-primary hover:underline focus:outline-none focus:underline"
            >
              Global I Tech Solutions Inc.
            </a>
          </p>
          {visitCount !== null && (
            <p className="flex items-center gap-1.5">
              <Eye className="size-4 shrink-0" aria-hidden />
              <span>Visitors: {visitCount.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
