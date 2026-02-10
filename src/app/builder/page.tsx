"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResumeStore } from "@/store/resumeStore";
import { resumeFormSchema, type ResumeFormValues } from "@/lib/resumeSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PenLine, Loader2 } from "lucide-react";
import Link from "next/link";
import { parseDocx } from "@/parsers/docxParser";
import { parsePdf } from "@/parsers/pdfParser";
import { BuilderContact } from "@/components/builder/BuilderContact";
import { BuilderExperience } from "@/components/builder/BuilderExperience";
import { BuilderEducation } from "@/components/builder/BuilderEducation";
import { BuilderSkills } from "@/components/builder/BuilderSkills";
import { BuilderOptional } from "@/components/builder/BuilderOptional";

const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "optional", label: "More" },
] as const;

function BuilderContent() {
  const searchParams = useSearchParams();
  const showUpload = searchParams.get("upload") === "1";
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const { resume, setResume, setFromParsed, saveDraft } = useResumeStore();
  const [saved, setSaved] = useState(false);

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
          setStep(0);
          if (result.errors?.length) setParseErrors(result.errors);
        } else {
          setParseErrors(result.errors ?? ["Failed to parse DOCX"]);
        }
      } else if (ext === "pdf") {
        const result = await parsePdf(file);
        if (result.success && result.resume) {
          setFromParsed(result.resume);
          form.reset({ ...resume, ...result.resume } as ResumeFormValues);
          setStep(0);
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

  const currentStepId = STEPS[step]?.id ?? "contact";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Fill in your details. You can switch templates and export anytime.</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              form.handleSubmit((values) => {
                updateStore(values);
                saveDraft().then(() => setSaved(true));
                setTimeout(() => setSaved(false), 2000);
              })();
            }}
          >
            {saved ? "Saved" : "Save draft"}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/templates">Templates</Link>
          </Button>
        </div>
      </div>

      {showUpload ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Upload existing resume
            </CardTitle>
            <CardDescription>
              We’ll try to extract contact, experience, and education. You’ll review and fix on the next steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/builder">Skip and enter manually</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <Tabs
            value={currentStepId}
            onValueChange={(v) => {
              const idx = STEPS.findIndex((s) => s.id === v);
              if (idx >= 0) setStep(idx);
            }}
          >
            <TabsList className="grid w-full grid-cols-5">
              {STEPS.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) => {
              updateStore(values);
              if (step < STEPS.length - 1) setStep(step + 1);
            })}
            className="space-y-6"
          >
            {currentStepId === "contact" && (
              <BuilderContact form={form} onUpdate={updateStore} />
            )}
            {currentStepId === "experience" && (
              <BuilderExperience form={form} onUpdate={updateStore} />
            )}
            {currentStepId === "education" && (
              <BuilderEducation form={form} onUpdate={updateStore} />
            )}
            {currentStepId === "skills" && (
              <BuilderSkills form={form} onUpdate={updateStore} />
            )}
            {currentStepId === "optional" && (
              <BuilderOptional form={form} onUpdate={updateStore} />
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => {
                    form.handleSubmit((values) => {
                      updateStore(values);
                      setStep(step + 1);
                    })()}
                  }
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Save & continue</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
