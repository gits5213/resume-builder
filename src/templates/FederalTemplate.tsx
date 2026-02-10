"use client";

import type { ResumeTemplateProps } from "./shared";
import { formatDateRange, SectionTitle, BulletList } from "./shared";

export function FederalTemplate({ resume, className = "" }: ResumeTemplateProps) {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    country,
    summary,
    objective,
    experience,
    education,
    skills,
    certifications,
    ksas,
  } = resume;

  const location = [address, city, state, zip, country].filter(Boolean).join(", ");

  return (
    <div className={`resume-template federal text-black text-sm ${className}`}>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
        <p className="text-xs">{email}</p>
        {phone ? <p className="text-xs">{phone}</p> : null}
        {location ? <p className="text-xs">{location}</p> : null}
      </header>

      {(summary || objective) ? (
        <section className="mb-4">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-sm">{summary || objective}</p>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Professional Experience</SectionTitle>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="font-semibold">{exp.title}</div>
                <p className="text-xs">
                  {exp.employer}
                  {exp.location ? ` — ${exp.location}` : ""}
                </p>
                <p className="text-xs">
                  {formatDateRange(exp)}
                  {exp.hoursPerWeek ? ` • ${exp.hoursPerWeek} hours/week` : ""}
                  {exp.series ? ` • Series ${exp.series}` : ""}
                  {exp.grade ? `, Grade ${exp.grade}` : ""}
                </p>
                {exp.salary ? <p className="text-xs">Salary: {exp.salary}</p> : null}
                {exp.supervisor ? (
                  <p className="text-xs">
                    Supervisor: {exp.supervisor}
                    {exp.supervisorPhone ? ` — ${exp.supervisorPhone}` : ""}
                    {exp.mayContact !== undefined ? ` (May contact: ${exp.mayContact ? "Yes" : "No"})` : ""}
                  </p>
                ) : null}
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
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="font-semibold">{edu.degree}</div>
                <p className="text-xs">
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ""}
                  {edu.major ? ` — ${edu.major}` : ""}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                </p>
                <p className="text-xs">{formatDateRange(edu)}</p>
                {edu.honors?.length ? (
                  <p className="text-xs">Honors: {edu.honors.join("; ")}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Skills</SectionTitle>
          <p className="text-sm">{skills.join(", ")}</p>
        </section>
      ) : null}

      {ksas.length > 0 ? (
        <section className="mb-4">
          <SectionTitle>Knowledge, Skills & Abilities</SectionTitle>
          <div className="space-y-3">
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
