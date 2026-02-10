"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormValues } from "@/lib/resumeSchema";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  form: UseFormReturn<ResumeFormValues>;
  onUpdate: (values: Partial<ResumeFormValues>) => void;
};

export function BuilderSkills({ form }: Props) {
  const { register, setValue, watch } = form;
  const skills = watch("skills") ?? [];

  const skillsString = Array.isArray(skills) ? skills.join(", ") : "";
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const list = value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    setValue("skills", list, { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <p className="text-sm text-muted-foreground">Enter skills separated by commas or new lines.</p>
      </CardHeader>
      <CardContent>
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          rows={5}
          value={skillsString}
          onChange={handleChange}
          placeholder="JavaScript, TypeScript, React, Node.js, Python, SQL, Agile, Leadership"
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
}
