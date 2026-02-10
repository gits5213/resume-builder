"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATE_LABELS, type TemplateId } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templateIds: TemplateId[] = ["city-state", "federal", "corporate", "biodata"];

export function Nav() {
  const pathname = usePathname();
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();
  const isHome = pathname === "/";

  return (
    <header className="no-print sticky top-0 z-50 w-full border-b border-border bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center gap-2 font-semibold tracking-tight",
            isHome ? "text-primary" : "text-foreground hover:text-primary transition-colors"
          )}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </span>
          <span className="hidden sm:inline">Resume Builder</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">Template</span>
          <Select
            value={selectedTemplate}
            onValueChange={(v) => setSelectedTemplate(v as TemplateId)}
          >
            <SelectTrigger className="h-9 w-[180px] rounded-lg border-border bg-muted/50">
              <SelectValue placeholder="Choose template" />
            </SelectTrigger>
            <SelectContent>
              {templateIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {TEMPLATE_LABELS[id]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
