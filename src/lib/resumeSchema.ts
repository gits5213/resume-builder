import { z } from "zod";

// Reusable primitives
const nonEmptyString = z.string().min(1, "Required").optional().or(z.literal(""));
export const stringOptional = z.string().optional();
export const stringRequired = z.string().min(1, "Required");

// Date range (for Federal: full dates; for others: month/year often enough)
export const dateRangeSchema = z.object({
  start: stringOptional,
  end: stringOptional,
  present: z.boolean().optional(),
});

// Single position/role
export const experienceItemSchema = z.object({
  id: z.string().optional(),
  title: stringRequired,
  employer: stringRequired,
  location: stringOptional,
  start: stringOptional,
  end: stringOptional,
  present: z.boolean().optional(),
  // Federal / detailed
  hoursPerWeek: stringOptional,
  salary: stringOptional,
  series: stringOptional,
  grade: stringOptional,
  supervisor: stringOptional,
  supervisorPhone: stringOptional,
  mayContact: z.boolean().optional(),
  accomplishments: z.array(z.string()).optional(),
  summary: stringOptional,
});

// Education entry
export const educationItemSchema = z.object({
  id: z.string().optional(),
  degree: stringRequired,
  institution: stringRequired,
  location: stringOptional,
  start: stringOptional,
  end: stringOptional,
  present: z.boolean().optional(),
  major: stringOptional,
  gpa: stringOptional,
  honors: z.array(z.string()).optional(),
});

// Certification
export const certificationSchema = z.object({
  id: z.string().optional(),
  name: stringRequired,
  issuer: stringOptional,
  date: stringOptional,
  url: stringOptional,
});

// Project (for Corporate / technical resumes)
export const projectSchema = z.object({
  id: z.string().optional(),
  name: stringRequired,
  description: stringOptional,
  url: stringOptional,
  technologies: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
});

// KSA / competency (City/State, Federal)
export const ksaSchema = z.object({
  id: z.string().optional(),
  title: stringRequired,
  narrative: stringRequired,
});

export const resumeSchema = z.object({
  // Meta
  id: z.string().optional(),
  title: z.string().optional(), // e.g. "Software Engineer - City"
  updatedAt: z.string().optional(),

  // Contact & basics
  fullName: stringRequired,
  email: stringRequired,
  phone: stringOptional,
  address: stringOptional,
  city: stringOptional,
  state: stringOptional,
  zip: stringOptional,
  country: stringOptional,
  linkedin: stringOptional,
  website: stringOptional,

  // Optional one-liner
  summary: stringOptional,
  objective: stringOptional,

  // Core sections (all formats)
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(certificationSchema).default([]),

  // Optional sections
  projects: z.array(projectSchema).default([]),
  ksas: z.array(ksaSchema).default([]),
  languages: z.array(z.string()).default([]),
  volunteer: z.array(experienceItemSchema).default([]),
  awards: z.array(z.object({ id: z.string().optional(), title: stringRequired, date: stringOptional, issuer: stringOptional })).default([]),
});

export type Resume = z.infer<typeof resumeSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type CertificationItem = z.infer<typeof certificationSchema>;
export type ProjectItem = z.infer<typeof projectSchema>;
export type KsaItem = z.infer<typeof ksaSchema>;

export const resumeFormSchema = resumeSchema;
export type ResumeFormValues = z.infer<typeof resumeFormSchema>;
