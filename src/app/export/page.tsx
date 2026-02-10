"use client";

import { useResumeStore } from "@/store/resumeStore";
import { ResumePreview } from "@/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Printer, FileDown } from "lucide-react";

export default function ExportPage() {
  const { resume, selectedTemplate } = useResumeStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export</h1>
        <p className="text-muted-foreground mt-1">
          Print to PDF using your browser’s print dialog, or copy/save the content below.
        </p>
      </div>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>Print to PDF</CardTitle>
          <CardDescription>
            Use &quot;Print&quot; below and choose &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; for best results.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Print / Save as PDF
          </Button>
          <Button asChild variant="outline">
            <Link href={`/preview/${selectedTemplate}`}>
              <FileDown className="mr-2 size-4" />
              Full-screen preview
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="resume-print-area bg-white text-black shadow-lg rounded-lg p-8 max-w-[8.5in] mx-auto min-h-[11in] border">
        <ResumePreview resume={resume} templateId={selectedTemplate} />
      </div>
    </div>
  );
}
