"use client";

import type { ResumeTemplateProps } from "./shared";
import { SectionTitle, formatDateRange } from "./shared";

export function BiodataTemplate({ resume, className = "" }: ResumeTemplateProps) {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    country,
    linkedin,
    website,
    summary,
    objective,
    education,
    experience,
    skills,
    languages,
  } = resume;

  const location = [address, city, state, zip, country].filter(Boolean).join(", ");

  const contactRows = [
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Address", value: location },
    { label: "LinkedIn", value: linkedin },
    { label: "Website", value: website },
  ].filter((row) => row.value);

  return (
    <div className={`resume-template biodata text-black text-sm ${className}`}>
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
      </header>

      {contactRows.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Biodata</SectionTitle>
          <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-y-1 text-sm">
            {contactRows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-semibold">{row.label}</dt>
                <dd className="pl-4 break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {(summary || objective) ? (
        <section className="mb-4">
          <SectionTitle>Profile</SectionTitle>
          <p className="text-sm">{summary || objective}</p>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-1">
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

      {experience.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-2">
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
                {exp.summary ? <p className="text-sm mt-0.5">{exp.summary}</p> : null}
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

      {languages.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Languages</SectionTitle>
          <p className="text-sm">{languages.join(", ")}</p>
        </section>
      ) : null}
    </div>
  );
}

