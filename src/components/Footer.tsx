"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const COUNTAPI_NAMESPACE = "gitsics-resume-builder";
const COUNTAPI_KEY = "visitors";
const COUNTAPI_BASE = "https://api.countapi.xyz";
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

export function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(() =>
    getCachedCount()
  );

  useEffect(() => {
    const alreadyHit = typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_HIT_KEY) === "1";
    const url = alreadyHit
      ? `${COUNTAPI_BASE}/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`
      : `${COUNTAPI_BASE}/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const value = typeof data.value === "number" ? data.value : null;
        if (value !== null) {
          setVisitCount(value);
          setCachedCount(value);
        }
        if (!alreadyHit && typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(SESSION_HIT_KEY, "1");
        }
      })
      .catch(() => {
        // Keep showing cached count if API fails
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
