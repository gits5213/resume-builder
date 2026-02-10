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

Static export output is in `out/` (used for GitHub Pages).

## Deploy to GitHub Pages

The repo includes a GitHub Action that builds and deploys to GitHub Pages on push to `main` or `master`.

1. **Enable GitHub Pages**
   - In your repo: **Settings → Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**

2. **Push to trigger deploy**
   - Push to `main` (or `master`). The workflow **Deploy to GitHub Pages** will run.
   - After it finishes, the site is at `https://<username>.github.io/<repo-name>/`

3. **Optional: custom domain**  
   - In **Settings → Pages** you can set a custom domain.

**Note:** The visitor count in the footer does not run on GitHub Pages (no server); the rest of the app works as a static site.

## Notes

- **ATS**: Templates use simple structure, safe fonts, and clear headings. No graphics/tables in ATS-oriented layouts.
- **PDF export**: Use the browser’s “Print” → “Save as PDF” for best quality.
- **Parsing**: DOCX parsing is best-effort; PDF is text-only. Always review after upload.
