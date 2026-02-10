import mammoth from "mammoth";
import type { Resume } from "@/lib/resumeSchema";

export interface ParseResult {
  success: boolean;
  resume: Partial<Resume>;
  rawHtml?: string;
  rawText?: string;
  errors?: string[];
}

/**
 * Extract text from DOCX and heuristically map to resume fields.
 * Output is best-effort; user should review in "Review & Fix" step.
 */
export async function parseDocx(file: File): Promise<ParseResult> {
  const errors: string[] = [];
  const buffer = await file.arrayBuffer();

  try {
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const text = stripHtmlToText(html);

    const resume = mapTextToResume(text, errors);
    return {
      success: true,
      resume,
      rawHtml: html,
      rawText: text,
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

function stripHtmlToText(html: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : { innerHTML: "", textContent: "" };
  if (typeof document !== "undefined") {
    (div as HTMLDivElement).innerHTML = html;
    return (div as HTMLDivElement).textContent?.replace(/\s+/g, " ").trim() ?? "";
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const EMAIL_REGEX = /[\w.-]+@[\w.-]+\.\w+/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function mapTextToResume(text: string, errors: string[]): Partial<Resume> {
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

  const allText = lines.join(" ");
  const possibleSkills = extractPossibleSkills(allText);
  if (possibleSkills.length) resume.skills = possibleSkills;

  const { experience, education } = extractSections(lines);
  if (experience.length) resume.experience = experience;
  if (education.length) resume.education = education;

  return resume;
}

function extractPossibleSkills(text: string): string[] {
  const skillKeywords = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
    "HTML", "CSS", "AWS", "Git", "REST", "API", "Agile", "Leadership",
    "Communication", "Project Management", "Excel", "Microsoft Office",
  ];
  const found = skillKeywords.filter((s) =>
    new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );
  return [...new Set(found)];
}

function extractSections(
  lines: string[]
): { experience: Resume["experience"]; education: Resume["education"] } {
  const experience: Resume["experience"] = [];
  const education: Resume["education"] = [];
  const sectionHeaders = /^(experience|work|employment|education|academic|skills|summary|objective)$/i;

  let currentSection: "experience" | "education" | null = null;
  let currentItem: Record<string, unknown> | null = null;
  let currentAccomplishments: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (sectionHeaders.test(line)) {
      if (currentItem && currentSection === "experience") {
        if (currentAccomplishments.length) (currentItem as { accomplishments?: string[] }).accomplishments = currentAccomplishments;
        experience.push(currentItem as Resume["experience"][0]);
      }
      if (currentItem && currentSection === "education") {
        education.push(currentItem as Resume["education"][0]);
      }
      currentAccomplishments = [];
      if (/experience|work|employment/i.test(line)) currentSection = "experience";
      else if (/education|academic/i.test(line)) currentSection = "education";
      else currentSection = null;
      currentItem = null;
      continue;
    }

    if (currentSection === "experience") {
      const titleEmployer = parseTitleEmployer(line);
      if (titleEmployer && !currentItem) {
        currentItem = { title: titleEmployer.title, employer: titleEmployer.employer, accomplishments: [] };
      } else if (currentItem && line.match(/^[-•*]\s*/)) {
        currentAccomplishments.push(line.replace(/^[-•*]\s*/, ""));
      } else if (currentItem && (line.includes("–") || line.includes("-") || line.includes(" to "))) {
        const d = parseDateRange(line);
        if (d) {
          currentItem.start = d.start;
          currentItem.end = d.end;
          currentItem.present = d.present;
        }
      }
    }

    if (currentSection === "education") {
      const degreeSchool = parseDegreeSchool(line);
      if (degreeSchool && !currentItem) {
        currentItem = { degree: degreeSchool.degree, institution: degreeSchool.institution };
      } else if (currentItem && line.match(/\d{4}/)) {
        const d = parseDateRange(line);
        if (d) {
          currentItem.start = d.start;
          currentItem.end = d.end;
        }
      }
    }
  }

  if (currentItem && currentSection === "experience") {
    if (currentAccomplishments.length) (currentItem as { accomplishments?: string[] }).accomplishments = currentAccomplishments;
    experience.push(currentItem as Resume["experience"][0]);
  }
  if (currentItem && currentSection === "education") {
    education.push(currentItem as Resume["education"][0]);
  }

  return { experience, education };
}

function parseTitleEmployer(line: string): { title: string; employer: string } | null {
  const at = line.lastIndexOf(" at ");
  if (at > 0) {
    return { title: line.slice(0, at).trim(), employer: line.slice(at + 4).trim() };
  }
  const dash = line.indexOf(" – ");
  if (dash > 0) {
    return { title: line.slice(0, dash).trim(), employer: line.slice(dash + 3).trim() };
  }
  if (line.length > 0 && line.length < 120) {
    return { title: line, employer: "Unknown" };
  }
  return null;
}

function parseDegreeSchool(line: string): { degree: string; institution: string } | null {
  const at = line.lastIndexOf(" at ");
  if (at > 0) return { degree: line.slice(0, at).trim(), institution: line.slice(at + 4).trim() };
  const comma = line.indexOf(", ");
  if (comma > 0) return { degree: line.slice(0, comma).trim(), institution: line.slice(comma + 2).trim() };
  if (line.length > 0 && line.length < 120) return { degree: line, institution: "Unknown" };
  return null;
}

function parseDateRange(line: string): { start?: string; end?: string; present?: boolean } | null {
  const present = /\b(?:present|current|now)\b/i.test(line);
  const years = line.match(/\b(19|20)\d{2}\b/g);
  if (years && years.length >= 1) {
    return {
      start: years[0],
      end: present ? undefined : (years[1] ?? years[0]),
      present,
    };
  }
  return null;
}
