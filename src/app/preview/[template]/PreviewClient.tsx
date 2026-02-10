"use client";

import { useResumeStore } from "@/store/resumeStore";
import { ResumePreview } from "@/templates";
import type { TemplateId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VALID_TEMPLATES: TemplateId[] = ["city-state", "federal", "corporate", "biodata"];

function isValidTemplate(t: string): t is TemplateId {
  return VALID_TEMPLATES.includes(t as TemplateId);
}

export function PreviewClient({ templateId: templateParam }: { templateId: string }) {
  const templateId = isValidTemplate(templateParam) ? templateParam : "corporate";
  const { resume } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <Button asChild variant="outline" size="sm">
          <Link href="/templates">← Templates</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print / Save as PDF
          </Button>
          <Button asChild size="sm">
            <Link href="/export">Export</Link>
          </Button>
        </div>
      </div>
      <div className="resume-print-area bg-white text-black shadow-lg rounded-lg p-8 max-w-[8.5in] mx-auto min-h-[11in]">
        <ResumePreview resume={resume} templateId={templateId} />
      </div>
    </div>
  );
}
