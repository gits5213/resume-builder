import type { TemplateId } from "@/lib/types";
import { PreviewClient } from "./PreviewClient";

const TEMPLATES: TemplateId[] = ["city-state", "federal", "corporate", "biodata"];

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ template }));
}

export default async function PreviewPage({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  return <PreviewClient templateId={template} />;
}
