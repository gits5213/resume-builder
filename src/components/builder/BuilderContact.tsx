"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormValues } from "@/lib/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  form: UseFormReturn<ResumeFormValues>;
  onUpdate: (values: Partial<ResumeFormValues>) => void;
};

export function BuilderContact({ form }: Props) {
  const { register, formState: { errors } } = form;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full name *</Label>
          <Input id="fullName" {...register("fullName")} placeholder="Jane Doe" />
          {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="jane@example.com" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} placeholder="(555) 123-4567" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} placeholder="123 Main St" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} placeholder="City" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} placeholder="State" />
        </div>
        <div>
          <Label htmlFor="zip">ZIP</Label>
          <Input id="zip" {...register("zip")} placeholder="ZIP" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} placeholder="Country" />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" {...register("website")} placeholder="https://..." />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="summary">Summary (optional)</Label>
          <Input id="summary" {...register("summary")} placeholder="Brief professional summary" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="objective">Objective (optional)</Label>
          <Input id="objective" {...register("objective")} placeholder="Career objective" />
        </div>
      </CardContent>
    </Card>
  );
}
