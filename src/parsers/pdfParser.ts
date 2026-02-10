import type { Resume } from "@/lib/resumeSchema";

export interface PdfParseResult {
  success: boolean;
  resume: Partial<Resume>;
  rawText?: string;
  errors?: string[];
}

/**
 * PDF parsing is limited in the browser without a backend.
 * We use pdfjs-dist to extract text only; mapping to resume fields is heuristic.
 * For best results, recommend users upload DOCX or use manual entry.
 */
export async function parsePdf(file: File): Promise<PdfParseResult> {
  const errors: string[] = [];

  try {
    const pdfjsLib = await import("pdfjs-dist");
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const numPages = pdf.numPages;
    const textParts: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? String((item as { str?: string }).str ?? "") : ""))
        .join(" ");
      textParts.push(text);
    }

    const rawText = textParts.join("\n\n").replace(/\s+/g, " ").trim();
    const resume = mapTextToResume(rawText, errors);

    return {
      success: true,
      resume,
      rawText,
      errors: errors.length ? errors : undefined,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      success: false,
      resume: {},
      errors: [message],
    };
  }
}

const EMAIL_REGEX = /[\w.-]+@[\w.-]+\.\w+/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function mapTextToResume(text: string, _errors: string[]): Partial<Resume> {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const resume: Partial<Resume> = {
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    ksas: [],
    languages: [],
    volunteer: [],
    awards: [],
  };

  const emailMatch = text.match(EMAIL_REGEX);
  if (emailMatch) resume.email = emailMatch[0];

  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch) resume.phone = phoneMatch[0];

  if (lines.length > 0 && !resume.fullName) {
    const first = lines[0];
    if (first.length < 80 && !first.includes("@")) resume.fullName = first;
  }

  const skillKeywords = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
    "HTML", "CSS", "AWS", "Git", "REST", "API", "Agile", "Leadership",
  ];
  const found = skillKeywords.filter((s) =>
    new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );
  if (found.length) resume.skills = [...new Set(found)];

  return resume;
}
