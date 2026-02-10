import { create } from "zustand";
import type { Resume } from "@/lib/resumeSchema";
import * as db from "@/lib/db";

export type TemplateId = "city-state" | "federal" | "corporate" | "biodata";

type ResumeState = {
  resume: Resume;
  selectedTemplate: TemplateId;
  draftId: string | null;
  isHydrated: boolean;
  setResume: (r: Resume | ((prev: Resume) => Resume)) => void;
  setSelectedTemplate: (t: TemplateId) => void;
  loadDraft: (id: string) => Promise<void>;
  saveDraft: () => Promise<string>;
  newResume: () => void;
  hydrate: () => Promise<void>;
  setFromParsed: (partial: Partial<Resume>) => void;
};

const emptyResume: Resume = {
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

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: emptyResume,
  selectedTemplate: "corporate",
  draftId: null,
  isHydrated: false,

  setResume: (r) => {
    set((s) => ({
      resume: typeof r === "function" ? r(s.resume) : r,
    }));
  },

  setSelectedTemplate: (t) => set({ selectedTemplate: t }),

  loadDraft: async (id) => {
    const draft = await db.getDraft(id);
    if (draft) {
      const { id: _id, ...rest } = draft;
      set({ resume: rest as Resume, draftId: id });
    }
  },

  saveDraft: async () => {
    const { resume, draftId } = get();
    const id = await db.saveDraft({ ...resume, id: draftId ?? undefined });
    set({ draftId: id });
    return id;
  },

  newResume: () =>
    set({
      resume: { ...emptyResume },
      draftId: null,
      selectedTemplate: "corporate",
    }),

  hydrate: async () => {
    if (typeof window === "undefined") return;
    set({ isHydrated: true });
  },

  setFromParsed: (partial) => {
    set((s) => ({
      resume: {
        ...s.resume,
        ...partial,
      },
    }));
  },
}));
