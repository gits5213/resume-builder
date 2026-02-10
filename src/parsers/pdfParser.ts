import type { Resume } from "@/lib/resumeSchema";
import { mapTextToResume } from "./mapTextToResume";

export interface PdfParseResult {
  success: boolean;
  resume: Partial<Resume>;
  rawText?: string;
  errors?: string[];
}

/**
 * Extract text from PDF and map to resume fields using shared parser.
 * Uses same section detection as DOCX: contact, summary, experience, education, skills, certifications, etc.
 */
export async function parsePdf(file: File): Promise<PdfParseResult> {
  const errors: string[] = [];

  try {
    const pdfjsLib: any = await import("pdfjs-dist/build/pdf");

    if (typeof window !== "undefined" && "Worker" in window) {
      const currentWorkerSrc = pdfjsLib.GlobalWorkerOptions?.workerSrc;
      if (!currentWorkerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }
    }

    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const numPages = pdf.numPages;
    const textParts: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items as Array<{ str?: string; hasEOL?: boolean }>;
      const line: string[] = [];
      for (const item of items) {
        const str = "str" in item ? String(item.str ?? "") : "";
        line.push(str);
        if (item.hasEOL) line.push("\n");
      }
      textParts.push(line.join("").replace(/\s+\n\s+/g, "\n").trim());
    }

    const rawText = textParts.join("\n\n");
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
