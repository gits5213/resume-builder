"use client";

import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormValues, CertificationItem, ProjectItem, KsaItem } from "@/lib/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  form: UseFormReturn<ResumeFormValues>;
  onUpdate: (values: Partial<ResumeFormValues>) => void;
};

const emptyCert: CertificationItem = { name: "", issuer: "", date: "" };
const emptyProject: ProjectItem = { name: "", description: "", technologies: [], highlights: [] };
const emptyKsa: KsaItem = { title: "", narrative: "" };

export function BuilderOptional({ form }: Props) {
  const { register, control, formState: { errors } } = form;
  const certs = useFieldArray({ control, name: "certifications" });
  const projects = useFieldArray({ control, name: "projects" });
  const ksas = useFieldArray({ control, name: "ksas" });

  return (
    <Tabs defaultValue="certifications">
      <TabsList>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="ksas">KSAs / Competencies</TabsTrigger>
      </TabsList>
      <TabsContent value="certifications" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Certifications</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => certs.append(emptyCert)}>
              <Plus className="size-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {certs.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 items-start border rounded p-3">
                <div className="flex-1 grid gap-2 sm:grid-cols-3">
                  <Input {...register(`certifications.${i}.name`)} placeholder="Certification name" />
                  <Input {...register(`certifications.${i}.issuer`)} placeholder="Issuer" />
                  <Input {...register(`certifications.${i}.date`)} placeholder="Date" />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => certs.remove(i)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => projects.append(emptyProject)}>
              <Plus className="size-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.fields.map((field, i) => (
              <div key={field.id} className="border rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <Input {...register(`projects.${i}.name`)} placeholder="Project name" className="max-w-xs" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => projects.remove(i)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Textarea {...register(`projects.${i}.description`)} placeholder="Description" rows={2} />
                <Input
                  placeholder="Tech (comma-separated)"
                  value={(form.watch(`projects.${i}.technologies`) ?? []).join(", ")}
                  onChange={(e) =>
                    form.setValue(
                      `projects.${i}.technologies`,
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      { shouldDirty: true }
                    )
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="ksas" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>KSAs / Competencies</CardTitle>
            <p className="text-sm text-muted-foreground">For City/State and Federal formats.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => ksas.append(emptyKsa)}>
              <Plus className="size-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {ksas.fields.map((field, i) => (
              <div key={field.id} className="border rounded p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <Input {...register(`ksas.${i}.title`)} placeholder="KSA title" className="max-w-xs" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => ksas.remove(i)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Textarea {...register(`ksas.${i}.narrative`)} placeholder="Narrative" rows={4} />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
