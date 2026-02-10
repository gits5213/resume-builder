"use client";

import type { TemplateId } from "@/lib/types";
import type { Resume } from "@/lib/resumeSchema";
import { CorporateTemplate } from "./CorporateTemplate";
import { FederalTemplate } from "./FederalTemplate";
import { CityStateTemplate } from "./CityStateTemplate";
import { BiodataTemplate } from "./BiodataTemplate";

const TEMPLATES: Record<TemplateId, React.ComponentType<{ resume: Resume; className?: string }>> = {
  corporate: CorporateTemplate,
  federal: FederalTemplate,
  "city-state": CityStateTemplate,
  biodata: BiodataTemplate,
};

export interface ResumePreviewProps {
  resume: Resume;
  templateId: TemplateId;
  className?: string;
}

export function ResumePreview({ resume, templateId, className }: ResumePreviewProps) {
  const Template = TEMPLATES[templateId];
  if (!Template) return null;
  return <Template resume={resume} className={className} />;
}

export { CorporateTemplate, FederalTemplate, CityStateTemplate, BiodataTemplate };
