"use client";

import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormValues, EducationItem } from "@/lib/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  form: UseFormReturn<ResumeFormValues>;
  onUpdate: (values: Partial<ResumeFormValues>) => void;
};

const emptyEducation: EducationItem = {
  degree: "",
  institution: "",
  location: "",
  start: "",
  end: "",
};

export function BuilderEducation({ form }: Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={() => append(emptyEducation)}>
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education entries yet. Click Add to add one.</p>
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
                  <Label>Degree *</Label>
                  <Input {...register(`education.${i}.degree`)} placeholder="B.S. Computer Science" />
                  {errors.education?.[i]?.degree && (
                    <p className="text-sm text-destructive">{errors.education[i]?.degree?.message}</p>
                  )}
                </div>
                <div>
                  <Label>Institution *</Label>
                  <Input {...register(`education.${i}.institution`)} placeholder="University of X" />
                  {errors.education?.[i]?.institution && (
                    <p className="text-sm text-destructive">{errors.education[i]?.institution?.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Location</Label>
                  <Input {...register(`education.${i}.location`)} placeholder="City, State" />
                </div>
                <div>
                  <Label>Start</Label>
                  <Input {...register(`education.${i}.start`)} placeholder="2016" />
                </div>
                <div>
                  <Label>End</Label>
                  <Input {...register(`education.${i}.end`)} placeholder="2020" />
                </div>
                <div>
                  <Label>Major</Label>
                  <Input {...register(`education.${i}.major`)} placeholder="Computer Science" />
                </div>
                <div>
                  <Label>GPA</Label>
                  <Input {...register(`education.${i}.gpa`)} placeholder="3.8" />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
