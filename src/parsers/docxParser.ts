import mammoth from "mammoth";
import type { Resume } from "@/lib/resumeSchema";
import { mapTextToResume } from "./mapTextToResume";

export interface ParseResult {
  success: boolean;
  resume: Partial<Resume>;
  rawHtml?: string;
  rawText?: string;
  errors?: string[];
}

/**
 * Extract text from DOCX and map to resume fields using shared parser.
 * Handles contact, summary, experience, education, skills, certifications, projects, KSAs, languages, awards.
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
  const blockNewline = html
    .replace(/<\/p>\s*/gi, "\n")
    .replace(/<\/div>\s*/gi, "\n")
    .replace(/<br\s*\/?>\s*/gi, "\n")
    .replace(/<\/tr>\s*/gi, "\n");
  const div = typeof document !== "undefined" ? document.createElement("div") : { innerHTML: "", textContent: "" };
  if (typeof document !== "undefined") {
    (div as HTMLDivElement).innerHTML = blockNewline;
    return (div as HTMLDivElement).textContent
      ?.replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim() ?? "";
  }
  return blockNewline.replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n").trim();
}
