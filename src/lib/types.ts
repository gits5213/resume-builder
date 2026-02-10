export type TemplateId = "city-state" | "federal" | "corporate";

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  "city-state": "City / State",
  federal: "Federal",
  corporate: "Corporate",
};

export const TEMPLATE_DESCRIPTIONS: Record<TemplateId, string> = {
  "city-state":
    "Concise, competency and achievements focused. Often includes KSAs.",
  federal:
    "Detailed: hours/week, series/grade, supervisor, salary, full dates, accomplishments.",
  corporate:
    "ATS-friendly one- or two-page modern format. Skills and projects highlighted.",
};
