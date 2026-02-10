"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Layout, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/builder", label: "Builder", icon: FileText },
  { href: "/templates", label: "Templates", icon: Layout },
  { href: "/export", label: "Export", icon: Download },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="no-print border-b border-border bg-card/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-6 h-12">
          <Link href="/" className="font-semibold text-primary flex items-center gap-2">
            <FileText className="size-5" />
            Resume Builder
          </Link>
          <div className="flex gap-1">
            {links.slice(1).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
