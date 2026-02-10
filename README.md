# Resume Builder

Front-end resume builder with **manual entry**, **upload existing resume** (DOCX/PDF), **ATS-friendly formats**, and **print/download**.

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** + **shadcn/ui** + **lucide-react**
- **React Hook Form + Zod** for forms and validation
- **Zustand** for global resume state
- **Dexie** (IndexedDB) for saving drafts
- **Mammoth** (DOCX) and **pdfjs-dist** (PDF) for upload parsing

## Features

- **Manual entry**: Multi-step builder (Contact → Experience → Education → Skills → More).
- **Upload**: Upload DOCX or PDF at `/builder?upload=1`; we parse what we can and you review/fix in the builder.
- **Templates**: City/State, Federal, Corporate — same data, different layouts.
- **Export**: Print to PDF via browser print (`@media print`), or use the Export page.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home and entry points |
| `/builder` | Multi-step form; `?upload=1` shows upload first |
| `/templates` | Choose template and preview |
| `/preview/[template]` | Full-screen preview (city-state \| federal \| corporate) |
| `/export` | Print / save as PDF |

## Data model

- **Zod schema**: `src/lib/resumeSchema.ts` (single model for all formats).
- **Store**: `src/store/resumeStore.ts` (Zustand).
- **Drafts**: `src/lib/db.ts` (Dexie IndexedDB).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Notes

- **ATS**: Templates use simple structure, safe fonts, and clear headings. No graphics/tables in ATS-oriented layouts.
- **PDF export**: Use the browser’s “Print” → “Save as PDF” for best quality.
- **Parsing**: DOCX parsing is best-effort; PDF is text-only. Always review after upload.
