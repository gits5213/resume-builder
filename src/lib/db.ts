import Dexie, { type EntityTable } from "dexie";
import type { Resume } from "./resumeSchema";

export class ResumeDatabase extends Dexie {
  resumes!: EntityTable<Resume & { id: string }, "id">;

  constructor() {
    super("ResumeBuilderDB");
    this.version(1).stores({
      resumes: "id, updatedAt, title",
    });
  }
}

export const db = new ResumeDatabase();

export async function saveDraft(resume: Resume): Promise<string> {
  const id = resume.id ?? crypto.randomUUID();
  const withMeta = {
    ...resume,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.resumes.put(withMeta as Resume & { id: string });
  return id;
}

export async function getDraft(id: string): Promise<(Resume & { id: string }) | undefined> {
  return db.resumes.get(id);
}

export async function listDrafts(): Promise<(Resume & { id: string })[]> {
  return db.resumes.orderBy("updatedAt").reverse().toArray();
}

export async function deleteDraft(id: string): Promise<void> {
  await db.resumes.delete(id);
}
