"use client";

import type { ResumeTemplateProps } from "./shared";
import { formatDateRange, SectionTitle, BulletList } from "./shared";

export function CorporateTemplate({ resume, className = "" }: ResumeTemplateProps) {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    linkedin,
    website,
    summary,
    experience,
    education,
    skills,
    certifications,
    projects,
  } = resume;

  const location = [city, state, zip].filter(Boolean).join(", ");
  const contactLine = [email, phone, address || location, linkedin, website].filter(Boolean).join(" • ");

  return (
    <div className={`resume-template corporate text-black text-sm ${className}`}>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
        <p className="text-xs text-black/80 break-all">{contactLine}</p>
      </header>

      {summary ? (
        <section className="mb-4">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-sm">{summary}</p>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold">{exp.title}</span>
                  <span className="text-xs shrink-0">{formatDateRange(exp)}</span>
                </div>
                <p className="text-xs text-black/70">
                  {exp.employer}
                  {exp.location ? `, ${exp.location}` : ""}
                </p>
                {exp.summary ? <p className="mt-1 text-sm">{exp.summary}</p> : null}
                {exp.accomplishments && exp.accomplishments.length > 0 ? (
                  <BulletList items={exp.accomplishments} />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="font-semibold">{edu.degree}</div>
                <p className="text-xs">
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ""}
                  {edu.major ? ` — ${edu.major}` : ""}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                </p>
                <p className="text-xs text-black/70">{formatDateRange(edu)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Skills</SectionTitle>
          <p className="text-sm">{skills.join(" • ")}</p>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-2">
            {projects.map((proj, i) => (
              <div key={i}>
                <span className="font-semibold">{proj.name}</span>
                {proj.description ? <p className="text-sm">{proj.description}</p> : null}
                {proj.technologies?.length ? (
                  <p className="text-xs text-black/70">{proj.technologies.join(", ")}</p>
                ) : null}
                {proj.highlights?.length ? <BulletList items={proj.highlights} /> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="list-none text-sm">
            {certifications.map((c, i) => (
              <li key={i}>
                {c.name}
                {c.issuer ? ` — ${c.issuer}` : ""}
                {c.date ? ` (${c.date})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
