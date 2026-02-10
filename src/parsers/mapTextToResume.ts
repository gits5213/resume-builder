import type { Resume } from "@/lib/resumeSchema";

const EMAIL_REGEX = /[\w.-]+@[\w.-]+\.\w+/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i;
const URL_REGEX = /https?:\/\/[^\s]+/g;

/** Section header patterns (order matters for precedence) */
const SECTION_PATTERNS = {
  experience: /^(professional\s+)?experience|work\s+(history|experience)|employment|career|career\s+history|positions?$/i,
  education: /^education|academic\s+(background|history)|qualifications?|degrees?|training$/i,
  skills: /^(technical\s+)?skills|core\s+competencies|technologies?|expertise|key\s+skills$/i,
  summary: /^summary|profile|objective|about\s+me|professional\s+summary|executive\s+summary$/i,
  certifications: /^certifications?|licenses?|credentials?|certificates?$/i,
  projects: /^projects?|key\s+projects?|selected\s+projects?|notable\s+projects?$/i,
  ksas: /^ksas?|knowledge,?\s*skills?\s*(and|&)\s*abilities|competencies?|key\s+competencies$/i,
  languages: /^languages?|language\s+skills?$/i,
  awards: /^awards?|honors?|recognitions?|achievements?$/i,
  volunteer: /^volunteer|volunteer\s+experience|community\s+service$/i,
} as const;

type SectionKey = keyof typeof SECTION_PATTERNS;

const SKILL_KEYWORDS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "C++", "C#", "Go", "Rust",
  "HTML", "CSS", "SASS", "AWS", "Azure", "GCP", "Git", "REST", "API", "GraphQL", "Docker", "Kubernetes",
  "Agile", "Scrum", "JIRA", "Leadership", "Communication", "Project Management", "Excel",
  "Microsoft Office", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Linux", "CI/CD", "TDD",
];

export function mapTextToResume(text: string, _errors: string[] = []): Partial<Resume> {
  const lines = text
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const resume: Partial<Resume> = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    linkedin: "",
    website: "",
    summary: "",
    objective: "",
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

  // Contact from full text
  const emailMatch = text.match(EMAIL_REGEX);
  if (emailMatch) resume.email = emailMatch[0];

  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch) resume.phone = phoneMatch[0];

  const linkedinMatch = text.match(LINKEDIN_REGEX);
  if (linkedinMatch) resume.linkedin = linkedinMatch[0];

  const urls = text.match(URL_REGEX) ?? [];
  const websiteUrl = urls.find((u) => !/linkedin\.com|facebook\.com|twitter\.com|youtube\.com/i.test(u));
  if (websiteUrl) resume.website = websiteUrl;

  // First line often name (short, no @)
  if (lines.length > 0) {
    const first = lines[0];
    if (first.length < 80 && !first.includes("@") && !EMAIL_REGEX.test(first) && !PHONE_REGEX.test(first)) {
      resume.fullName = first;
    }
  }

  // Address: look for line with comma-separated city, state zip or "City, ST" pattern
  const stateZipLine = lines.find((l) => /\b[A-Z]{2}\s+\d{5}(-\d{4})?\b|\d{5}\s+[A-Za-z\s]+/.test(l));
  if (stateZipLine) {
    const stateZipMatch = stateZipLine.match(/([A-Za-z\s]+),\s*([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
    if (stateZipMatch) {
      resume.city = stateZipMatch[1].trim();
      resume.state = stateZipMatch[2];
      resume.zip = stateZipMatch[3];
    }
    if (!resume.address && stateZipLine.length < 120) resume.address = stateZipLine;
  }

  const sections = detectSections(lines);
  const sectionLines = (key: SectionKey) => sections[key] ?? [];

  // Summary / Objective
  const summaryLines = sectionLines("summary");
  if (summaryLines.length) {
    const summaryText = summaryLines.join(" ").trim();
    if (summaryText.length > 0) {
      resume.summary = summaryText.slice(0, 2000);
      if (!resume.objective) resume.objective = summaryText.slice(0, 500);
    }
  }

  // Experience
  const expLines = sectionLines("experience");
  if (expLines.length) resume.experience = parseExperience(expLines);
  else {
    const { experience } = extractExperienceEducationFallback(lines);
    if (experience.length) resume.experience = experience;
  }

  // Education
  const eduLines = sectionLines("education");
  if (eduLines.length) resume.education = parseEducation(eduLines);
  else {
    const { education } = extractExperienceEducationFallback(lines);
    if (education.length) resume.education = education;
  }

  // Skills: from section first, then keyword scan
  const skillLines = sectionLines("skills");
  if (skillLines.length) {
    const fromSection = parseListItems(skillLines);
    resume.skills = fromSection.length ? fromSection : resume.skills ?? [];
  }
  if (!resume.skills?.length) {
    const found = SKILL_KEYWORDS.filter((s) =>
      new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
    );
    if (found.length) resume.skills = [...new Set(found)];
  }

  // Certifications
  const certLines = sectionLines("certifications");
  if (certLines.length) resume.certifications = parseCertifications(certLines);

  // Projects
  const projLines = sectionLines("projects");
  if (projLines.length) resume.projects = parseProjects(projLines);

  // KSAs
  const ksaLines = sectionLines("ksas");
  if (ksaLines.length) resume.ksas = parseKsas(ksaLines);

  // Languages
  const langLines = sectionLines("languages");
  if (langLines.length) resume.languages = parseListItems(langLines);

  // Awards
  const awardLines = sectionLines("awards");
  if (awardLines.length) resume.awards = parseAwards(awardLines);

  // Volunteer
  const volLines = sectionLines("volunteer");
  if (volLines.length) resume.volunteer = parseExperience(volLines);

  return resume;
}

function detectSections(lines: string[]): Partial<Record<SectionKey, string[]>> {
  const result: Partial<Record<SectionKey, string[]>> = {};
  let current: SectionKey | null = null;
  const collected: string[] = [];

  for (const line of lines) {
    let matched: SectionKey | null = null;
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS) as [SectionKey, RegExp][]) {
      if (pattern.test(line)) {
        matched = key;
        break;
      }
    }
    if (matched) {
      if (current && collected.length) {
        result[current] = [...collected];
      }
      current = matched;
      collected.length = 0;
    } else if (current) {
      collected.push(line);
    }
  }
  if (current && collected.length) result[current] = [...collected];
  return result;
}

function parseListItems(lines: string[]): string[] {
  const items: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*]\s*/, "").trim();
    if (!cleaned) continue;
    const parts = cleaned.split(/[,;]|\s+and\s+/).map((p) => p.trim()).filter(Boolean);
    items.push(...parts);
  }
  return [...new Set(items)].slice(0, 100);
}

function parseTitleEmployer(line: string): { title: string; employer: string } | null {
  if (line.length > 200) return null;
  const at = line.lastIndexOf(" at ");
  if (at > 0) return { title: line.slice(0, at).trim(), employer: line.slice(at + 4).trim() };
  const dash = line.indexOf(" – ");
  if (dash > 0) return { title: line.slice(0, dash).trim(), employer: line.slice(dash + 3).trim() };
  const pipe = line.indexOf(" | ");
  if (pipe > 0) return { title: line.slice(0, pipe).trim(), employer: line.slice(pipe + 3).trim() };
  const comma = line.indexOf(", ");
  if (comma > 0 && comma < 80) return { title: line.slice(0, comma).trim(), employer: line.slice(comma + 2).trim() };
  const hyphen = line.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (hyphen) return { title: hyphen[1].trim(), employer: hyphen[2].trim() };
  if (line.length > 0 && line.length < 120 && !line.match(/^\d|^[-•*]/)) {
    return { title: line, employer: "Unknown" };
  }
  return null;
}

function parseDateRange(line: string): { start?: string; end?: string; present?: boolean } | null {
  const present = /\b(?:present|current|now|ongoing)\b/i.test(line);
  const months = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b/gi;
  const monthMatches = line.match(months);
  if (monthMatches && monthMatches.length >= 1) {
    const start = monthMatches[0].replace(/\s+/g, " ").trim();
    const end = present ? undefined : (monthMatches[1] ?? monthMatches[0]).replace(/\s+/g, " ").trim();
    return { start, end, present };
  }
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

function parseExperience(lines: string[]): Resume["experience"] {
  const experience: Resume["experience"] = [];
  let current: Resume["experience"][0] | null = null;
  let accomplishments: string[] = [];

  for (const line of lines) {
    const titleEmployer = parseTitleEmployer(line);
    if (titleEmployer) {
      if (current) {
        if (accomplishments.length) current.accomplishments = accomplishments;
        experience.push(current);
        accomplishments = [];
      }
      current = {
        title: titleEmployer.title,
        employer: titleEmployer.employer,
        accomplishments: [],
      };
    } else if (current) {
      const d = parseDateRange(line);
      if (d && (line.includes("–") || line.includes("-") || line.includes(" to ") || /\d{4}/.test(line))) {
        current.start = d.start;
        current.end = d.end;
        current.present = d.present;
      } else if (/^[-•*]\s*/.test(line)) {
        accomplishments.push(line.replace(/^[-•*]\s*/, "").trim());
      } else if (line.length > 20 && line.length < 300 && !parseTitleEmployer(line)) {
        if (!current.summary) current.summary = line;
        else current.summary += " " + line;
      }
    }
  }
  if (current) {
    if (accomplishments.length) current.accomplishments = accomplishments;
    experience.push(current);
  }
  return experience;
}

function parseDegreeSchool(line: string): { degree: string; institution: string } | null {
  if (line.length > 200) return null;
  const at = line.lastIndexOf(" at ");
  if (at > 0) return { degree: line.slice(0, at).trim(), institution: line.slice(at + 4).trim() };
  const comma = line.indexOf(", ");
  if (comma > 0) return { degree: line.slice(0, comma).trim(), institution: line.slice(comma + 2).trim() };
  const dash = line.indexOf(" – ");
  if (dash > 0) return { degree: line.slice(0, dash).trim(), institution: line.slice(dash + 3).trim() };
  if (line.length > 0 && line.length < 120) return { degree: line, institution: "Unknown" };
  return null;
}

function parseEducation(lines: string[]): Resume["education"] {
  const education: Resume["education"] = [];
  let current: Resume["education"][0] | null = null;

  for (const line of lines) {
    const degreeSchool = parseDegreeSchool(line);
    if (degreeSchool && !current) {
      if (current) education.push(current);
      current = { degree: degreeSchool.degree, institution: degreeSchool.institution };
    } else if (current) {
      const d = parseDateRange(line);
      if (d && (/\d{4}/.test(line) || /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(line))) {
        current.start = d.start;
        current.end = d.end;
        current.present = d.present;
      } else if (/\bGPA\b/i.test(line)) {
        const gpa = line.match(/[\d.]+/);
        if (gpa) current.gpa = gpa[0];
      } else if (line.length > 0 && line.length < 150 && !/^[-•*]/.test(line)) {
        if (!current.major && !line.match(/\d{4}/)) current.major = line;
      }
    }
  }
  if (current) education.push(current);
  return education;
}

function parseCertifications(lines: string[]): Resume["certifications"] {
  const certs: Resume["certifications"] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*]\s*/, "").trim();
    if (!cleaned || cleaned.length < 2) continue;
    const dash = cleaned.indexOf(" – ");
    const at = cleaned.indexOf(" | ");
    const paren = cleaned.indexOf(" (");
    const name = (dash > 0 ? cleaned.slice(0, dash) : at > 0 ? cleaned.slice(0, at) : paren > 0 ? cleaned.slice(0, paren) : cleaned).trim();
    const rest = (dash > 0 ? cleaned.slice(dash + 3) : at > 0 ? cleaned.slice(at + 3) : paren > 0 ? cleaned.slice(paren + 2) : "").trim();
    const dateMatch = rest.match(/\b(19|20)\d{2}\b/);
    const issuer = rest.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim();
    certs.push({
      name: name || cleaned,
      issuer: issuer || undefined,
      date: dateMatch ? dateMatch[0] : undefined,
    });
  }
  return certs;
}

function parseProjects(lines: string[]): Resume["projects"] {
  const projects: Resume["projects"] = [];
  let current: Resume["projects"][0] | null = null;
  const highlights: string[] = [];

  for (const line of lines) {
    const bullet = line.replace(/^[-•*]\s*/, "").trim();
    if (bullet.length < 2) continue;
    if (bullet.length < 100 && !bullet.startsWith("http") && !/^[-•*]/.test(line)) {
      if (current && highlights.length) {
        current.highlights = highlights.splice(0);
      }
      current = { name: bullet, description: "", technologies: [], highlights: [] };
      projects.push(current);
    } else if (current) {
      if (/^[-•*]/.test(line)) highlights.push(bullet);
      else if (!current.description) current.description = bullet;
      else current.description += " " + bullet;
    }
  }
  if (current && highlights.length) current.highlights = highlights;
  return projects;
}

function parseKsas(lines: string[]): Resume["ksas"] {
  const ksas: Resume["ksas"] = [];
  let current: Resume["ksas"][0] | null = null;

  for (const line of lines) {
    const trimmed = line.replace(/^[-•*]\s*/, "").trim();
    if (!trimmed) continue;
    if (trimmed.length < 80 && !current) {
      current = { title: trimmed, narrative: "" };
    } else if (trimmed.length < 80 && current && !current.narrative) {
      ksas.push(current);
      current = { title: trimmed, narrative: "" };
    } else if (current) {
      current.narrative = (current.narrative + " " + trimmed).trim();
    }
  }
  if (current) ksas.push(current);
  return ksas;
}

function parseAwards(lines: string[]): Resume["awards"] {
  return lines
    .map((line) => {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (!cleaned) return null;
      const dateMatch = cleaned.match(/\b(19|20)\d{2}\b/);
      const title = cleaned.replace(/\s*[\(\[]?\d{4}[\)\]]?\s*$/, "").trim();
      return { title: title || cleaned, date: dateMatch ? dateMatch[0] : undefined, issuer: undefined };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);
}

/** Fallback when no clear section headers: try to find experience/education by date lines and structure */
function extractExperienceEducationFallback(
  lines: string[]
): { experience: Resume["experience"]; education: Resume["education"] } {
  const experience: Resume["experience"] = [];
  const education: Resume["education"] = [];
  const sectionHeaders = /^(experience|work|employment|education|academic|skills|summary|objective|certifications|projects)$/i;
  let currentSection: "experience" | "education" | null = null;
  let currentExp: Resume["experience"][0] | null = null;
  let currentEdu: Resume["education"][0] | null = null;
  let accomplishments: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (sectionHeaders.test(line)) {
      if (currentExp) {
        if (accomplishments.length) currentExp.accomplishments = accomplishments;
        experience.push(currentExp);
      }
      if (currentEdu) education.push(currentEdu);
      accomplishments = [];
      currentExp = null;
      currentEdu = null;
      if (/experience|work|employment/i.test(line)) currentSection = "experience";
      else if (/education|academic/i.test(line)) currentSection = "education";
      else currentSection = null;
      continue;
    }

    if (currentSection === "experience") {
      const titleEmployer = parseTitleEmployer(line);
      if (titleEmployer && !currentExp) {
        currentExp = { title: titleEmployer.title, employer: titleEmployer.employer, accomplishments: [] };
      } else if (currentExp && /^[-•*]\s*/.test(line)) {
        accomplishments.push(line.replace(/^[-•*]\s*/, ""));
      } else if (currentExp && (line.includes("–") || line.includes("-") || line.includes(" to ") || /\d{4}/.test(line))) {
        const d = parseDateRange(line);
        if (d) {
          currentExp.start = d.start;
          currentExp.end = d.end;
          currentExp.present = d.present;
        }
      }
    }

    if (currentSection === "education") {
      const degreeSchool = parseDegreeSchool(line);
      if (degreeSchool && !currentEdu) {
        currentEdu = { degree: degreeSchool.degree, institution: degreeSchool.institution };
      } else if (currentEdu && /\d{4}/.test(line)) {
        const d = parseDateRange(line);
        if (d) {
          currentEdu.start = d.start;
          currentEdu.end = d.end;
        }
      }
    }
  }

  if (currentExp) {
    if (accomplishments.length) currentExp.accomplishments = accomplishments;
    experience.push(currentExp);
  }
  if (currentEdu) education.push(currentEdu);

  return { experience, education };
}
