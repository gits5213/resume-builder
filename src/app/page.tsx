"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResumeStore } from "@/store/resumeStore";
import { resumeFormSchema, type ResumeFormValues } from "@/lib/resumeSchema";
import { ResumePreview } from "@/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Printer, FileDown } from "lucide-react";
import { parseDocx } from "@/parsers/docxParser";
import { parsePdf } from "@/parsers/pdfParser";
import { BuilderContact } from "@/components/builder/BuilderContact";
import { BuilderExperience } from "@/components/builder/BuilderExperience";
import { BuilderEducation } from "@/components/builder/BuilderEducation";
import { BuilderSkills } from "@/components/builder/BuilderSkills";
import { BuilderOptional } from "@/components/builder/BuilderOptional";

export default function HomePage() {
  const { resume, setResume, setFromParsed, selectedTemplate } = useResumeStore();
  const [uploading, setUploading] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const getDefaultValues = useCallback((): ResumeFormValues => ({
    ...resume,
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
    certifications: resume.certifications ?? [],
    projects: resume.projects ?? [],
    ksas: resume.ksas ?? [],
    languages: resume.languages ?? [],
    volunteer: resume.volunteer ?? [],
    awards: resume.awards ?? [],
  }), [resume]);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema) as never,
    defaultValues: getDefaultValues(),
  });

  const syncStoreToForm = useCallback(() => {
    form.reset(getDefaultValues());
  }, [form, getDefaultValues]);

  useEffect(() => {
    syncStoreToForm();
  }, [syncStoreToForm]);

  const updateStore = (values: Partial<ResumeFormValues>) => {
    setResume((prev) => ({ ...prev, ...values }));
  };

  const onFileSelect = async (file: File) => {
    setUploading(true);
    setParseErrors([]);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "docx") {
        const result = await parseDocx(file);
        if (result.success && result.resume) {
          setFromParsed(result.resume);
          form.reset({ ...resume, ...result.resume } as ResumeFormValues);
          if (result.errors?.length) setParseErrors(result.errors);
        } else {
          setParseErrors(result.errors ?? ["Failed to parse DOCX"]);
        }
      } else if (ext === "pdf") {
        const result = await parsePdf(file);
        if (result.success && result.resume) {
          setFromParsed(result.resume);
          form.reset({ ...resume, ...result.resume } as ResumeFormValues);
          if (result.errors?.length) setParseErrors(result.errors);
        } else {
          setParseErrors(result.errors ?? ["Failed to parse PDF"]);
        }
      } else {
        setParseErrors(["Please upload a .docx or .pdf file."]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="no-print space-y-10 pb-12">
      {/* Hero + Upload */}
      <section>
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Build your resume
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Enter your details manually or upload a DOCX/PDF to parse — your data is automatically turned into an <strong className="text-foreground">ATS-friendly resume</strong>. Choose a template above; the preview updates as you type.
          </p>
        </div>

        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="size-5 text-primary" />
              Upload existing resume
            </CardTitle>
            <CardDescription>
              We’ll extract your data and build an ATS-friendly resume. You can edit and re-export anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-28 cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors hover:bg-muted/60">
              <input
                type="file"
                className="hidden"
                accept=".docx,.pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileSelect(f);
                }}
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-sm text-muted-foreground">Drop .docx or .pdf here, or click to choose</span>
              )}
            </label>
            {parseErrors.length > 0 && (
              <ul className="text-sm text-destructive">
                {parseErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Form + Preview in two columns */}
      <section className="grid gap-8 lg:grid-cols-[1fr,420px]">
        <div className="space-y-6">
          <form
            onSubmit={form.handleSubmit((values) => updateStore(values))}
            className="space-y-6"
          >
            <BuilderContact form={form} onUpdate={updateStore} />
            <BuilderExperience form={form} onUpdate={updateStore} />
            <BuilderEducation form={form} onUpdate={updateStore} />
            <BuilderSkills form={form} onUpdate={updateStore} />
            <BuilderOptional form={form} onUpdate={updateStore} />
          </form>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Live Preview</CardTitle>
              <CardDescription>ATS-friendly resume from your data. Use Print / Save as PDF to download.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-auto rounded-lg border border-border bg-white p-5 text-black shadow-inner print:max-h-none">
                <ResumePreview resume={resume} templateId={selectedTemplate} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Print & Download */}
      <section id="print-download" className="scroll-mt-8">
        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Print &amp; Download</CardTitle>
            <CardDescription>
              Your resume is already ATS-friendly. Use &quot;Print&quot; and choose &quot;Save as PDF&quot; to download.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} className="rounded-lg">
              <Printer className="mr-2 size-4" />
              Print / Save as PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="rounded-lg border-border"
            >
              <FileDown className="mr-2 size-4" />
              Download as PDF
            </Button>
          </CardContent>
        </Card>
      </section>
      </div>

      {/* Only visible when printing – resume PDF */}
      <div className="resume-print-wrapper hidden print:!block">
        <div className="resume-print-area bg-white text-black p-8 max-w-[8.5in] mx-auto min-h-[11in]">
          <ResumePreview resume={resume} templateId={selectedTemplate} />
        </div>
      </div>
    </>
  );
}
