"use client";

import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormValues, ExperienceItem } from "@/lib/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  form: UseFormReturn<ResumeFormValues>;
  onUpdate: (values: Partial<ResumeFormValues>) => void;
};

const emptyExperience: ExperienceItem = {
  title: "",
  employer: "",
  location: "",
  start: "",
  end: "",
  accomplishments: [],
};

export function BuilderExperience({ form }: Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "experience" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={() => append(emptyExperience)}>
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience entries yet. Click Add to add one.</p>
        ) : (
          fields.map((field, i) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Entry {i + 1}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Job title *</Label>
                  <Input {...register(`experience.${i}.title`)} placeholder="Software Engineer" />
                  {errors.experience?.[i]?.title && (
                    <p className="text-sm text-destructive">{errors.experience[i]?.title?.message}</p>
                  )}
                </div>
                <div>
                  <Label>Employer *</Label>
                  <Input {...register(`experience.${i}.employer`)} placeholder="Acme Inc." />
                  {errors.experience?.[i]?.employer && (
                    <p className="text-sm text-destructive">{errors.experience[i]?.employer?.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Location</Label>
                  <Input {...register(`experience.${i}.location`)} placeholder="City, State" />
                </div>
                <div>
                  <Label>Start</Label>
                  <Input {...register(`experience.${i}.start`)} placeholder="Jan 2020" />
                </div>
                <div>
                  <Label>End (or leave blank if current)</Label>
                  <Input {...register(`experience.${i}.end`)} placeholder="Present" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Summary (optional)</Label>
                  <Textarea {...register(`experience.${i}.summary`)} rows={2} placeholder="Brief description" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Accomplishments (one per line, optional)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Achieved X&#10;Led Y&#10;Reduced Z by 20%"
                    className="font-mono text-sm"
                    value={(form.watch(`experience.${i}.accomplishments`) ?? []).join("\n")}
                    onChange={(e) =>
                      form.setValue(
                        `experience.${i}.accomplishments`,
                        e.target.value.split(/\n/).map((s) => s.trim()).filter(Boolean),
                        { shouldDirty: true }
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
