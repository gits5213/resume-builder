import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const VISITS_FILE = path.join(DATA_DIR, "visits.json");

function getCount(): number {
  try {
    if (existsSync(VISITS_FILE)) {
      const data = JSON.parse(readFileSync(VISITS_FILE, "utf-8"));
      return typeof data.count === "number" ? data.count : 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

function setCount(count: number): void {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(VISITS_FILE, JSON.stringify({ count }, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

export async function GET() {
  const count = getCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = getCount() + 1;
  setCount(count);
  return NextResponse.json({ count });
}
