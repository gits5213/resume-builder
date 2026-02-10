"use client";

import Link from "next/link";
import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATE_LABELS, TEMPLATE_DESCRIPTIONS, type TemplateId } from "@/lib/types";
import { ResumePreview } from "@/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TemplatesPage() {
  const { resume, selectedTemplate, setSelectedTemplate } = useResumeStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Choose a format. Your data stays the same; only the layout changes.
        </p>
      </div>

      <Tabs value={selectedTemplate} onValueChange={(v) => setSelectedTemplate(v as TemplateId)}>
        <TabsList className="grid w-full grid-cols-3">
          {(Object.keys(TEMPLATE_LABELS) as TemplateId[]).map((id) => (
            <TabsTrigger key={id} value={id}>
              {TEMPLATE_LABELS[id]}
            </TabsTrigger>
          ))}
        </TabsList>
        {(Object.keys(TEMPLATE_LABELS) as TemplateId[]).map((id) => (
          <TabsContent key={id} value={id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{TEMPLATE_LABELS[id]}</CardTitle>
                <CardDescription>{TEMPLATE_DESCRIPTIONS[id]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-white text-black p-6 max-w-2xl mx-auto shadow-sm">
                  <ResumePreview resume={resume} templateId={id} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button asChild>
                    <Link href={`/preview/${id}`}>Preview full screen</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/export">Export / Print</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
