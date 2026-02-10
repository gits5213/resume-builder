"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visit", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setVisitCount(data.count))
      .catch(() => setVisitCount(null));
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
