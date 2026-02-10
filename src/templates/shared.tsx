import type { Resume } from "@/lib/resumeSchema";

export interface ResumeTemplateProps {
  resume: Resume;
  className?: string;
}

export function formatDateRange(item: { start?: string; end?: string; present?: boolean }): string {
  if (!item.start && !item.end) return "";
  const end = item.present ? "Present" : (item.end ?? "");
  return [item.start, end].filter(Boolean).join(" – ");
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider border-b border-black/20 pb-0.5 mb-2 print:border-black/30">
      {children}
    </h2>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-0.5 text-sm">
      {items.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}
