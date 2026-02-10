"use client";

import type { ResumeTemplateProps } from "./shared";
import { formatDateRange, SectionTitle, BulletList } from "./shared";

export function CityStateTemplate({ resume, className = "" }: ResumeTemplateProps) {
  const {
    fullName,
    email,
    phone,
    city,
    state,
    summary,
    experience,
    education,
    skills,
    certifications,
    ksas,
  } = resume;

  const location = [city, state].filter(Boolean).join(", ");
  const contact = [email, phone, location].filter(Boolean).join(" • ");

  return (
    <div className={`resume-template city-state text-black text-sm ${className}`}>
      <header className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">{fullName}</h1>
        <p className="text-xs text-black/80">{contact}</p>
      </header>

      {summary ? (
        <section className="mb-3">
          <SectionTitle>Profile</SectionTitle>
          <p className="text-sm">{summary}</p>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mb-3">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-2">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold">{exp.title}</span>
                  <span className="text-xs shrink-0">{formatDateRange(exp)}</span>
                </div>
                <p className="text-xs text-black/70">{exp.employer}{exp.location ? `, ${exp.location}` : ""}</p>
                {exp.accomplishments && exp.accomplishments.length > 0 ? (
                  <BulletList items={exp.accomplishments} />
                ) : exp.summary ? (
                  <p className="text-sm mt-0.5">{exp.summary}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mb-3">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1">
            {education.map((edu, i) => (
              <div key={i}>
                <span className="font-semibold">{edu.degree}</span>
                {edu.institution ? ` — ${edu.institution}` : ""}
                {edu.location ? `, ${edu.location}` : ""}
                {formatDateRange(edu) ? ` (${formatDateRange(edu)})` : ""}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="mb-3">
          <SectionTitle>Skills</SectionTitle>
          <p className="text-sm">{skills.join(", ")}</p>
        </section>
      ) : null}

      {ksas.length > 0 ? (
        <section className="mb-3">
          <SectionTitle>Competencies / KSAs</SectionTitle>
          <div className="space-y-2">
            {ksas.map((ksa, i) => (
              <div key={i}>
                <div className="font-semibold">{ksa.title}</div>
                <p className="text-sm">{ksa.narrative}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section className="mb-3">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="list-none text-sm">
            {certifications.map((c, i) => (
              <li key={i}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? ` (${c.date})` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
