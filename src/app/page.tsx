import Link from "next/link";
import { FileText, Upload, PenLine, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Resume Builder</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build ATS-friendly resumes in City/State, Federal, or Corporate formats. Enter once, switch templates, export anytime.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/builder">
              <PenLine className="mr-2 size-4" />
              Start building
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/templates">
              <FileText className="mr-2 size-4" />
              Choose template
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <PenLine className="size-8 text-primary mb-2" />
            <CardTitle>Manual entry</CardTitle>
            <CardDescription>Step-by-step form for contact, experience, education, skills, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/builder">Go to builder</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Upload className="size-8 text-primary mb-2" />
            <CardTitle>Upload resume</CardTitle>
            <CardDescription>Upload DOCX or PDF and we’ll parse what we can. You’ll review and fix before saving.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/builder?upload=1">Upload in builder</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="size-8 text-primary mb-2" />
            <CardTitle>ATS-friendly formats</CardTitle>
            <CardDescription>City/State, Federal, and Corporate templates with clean structure and safe fonts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/templates">View templates</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileDown className="size-8 text-primary mb-2" />
            <CardTitle>Print & download</CardTitle>
            <CardDescription>Export via browser print to PDF or use the export page for a clean print layout.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/export">Export</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
