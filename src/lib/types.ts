export type TemplateId = "city-state" | "federal" | "corporate" | "biodata";

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  "city-state": "City / State",
  federal: "Federal",
  corporate: "Corporate",
  biodata: "Biodata Template",
};

export const TEMPLATE_DESCRIPTIONS: Record<TemplateId, string> = {
  "city-state":
    "Concise, competency and achievements focused. Often includes KSAs.",
  federal:
    "Detailed: hours/week, series/grade, supervisor, salary, full dates, accomplishments.",
  corporate:
    "ATS-friendly one- or two-page modern format. Skills and projects highlighted.",
  biodata:
    "Simple, personal biodata style layout with key contact details and a compact overview.",
};
