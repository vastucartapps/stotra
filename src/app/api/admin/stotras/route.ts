import { NextResponse } from "next/server";
import { getAllStotrasIncludingDrafts, saveStotra } from "@/lib/stotras";
import type { Stotra } from "@/types";

function validateStotra(data: unknown): data is Stotra {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.slug === "string" &&
    typeof d.title === "string" &&
    typeof d.titleEn === "string" &&
    typeof d.deity === "string" &&
    typeof d.devanagariText === "string" &&
    d.slug.length > 0 &&
    d.title.length > 0 &&
    d.titleEn.length > 0
  );
}

export async function GET() {
  const stotras = getAllStotrasIncludingDrafts();
  return NextResponse.json(stotras);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle bulk import (array of stotras)
    if (Array.isArray(body)) {
      const results: { slug: string; success: boolean; error?: string }[] = [];
      for (const item of body) {
        if (!validateStotra(item)) {
          results.push({
            slug: (item as Record<string, unknown>)?.slug as string || "unknown",
            success: false,
            error: "Invalid stotra data",
          });
          continue;
        }
        try {
          saveStotra(item);
          results.push({ slug: item.slug, success: true });
        } catch {
          results.push({ slug: item.slug, success: false, error: "Failed to save" });
        }
      }
      return NextResponse.json({ results });
    }

    // Single stotra
    if (!validateStotra(body)) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, titleEn, deity, devanagariText" },
        { status: 400 }
      );
    }

    saveStotra(body);
    return NextResponse.json({ success: true, slug: body.slug });
  } catch {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
