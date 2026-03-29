import { NextResponse } from "next/server";
import { getAllStotrasIncludingDrafts, saveStotra } from "@/lib/stotras";
import type { Stotra } from "@/types";

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
      for (const stotra of body) {
        try {
          saveStotra(stotra as Stotra);
          results.push({ slug: stotra.slug, success: true });
        } catch (e) {
          results.push({
            slug: stotra.slug || "unknown",
            success: false,
            error: String(e),
          });
        }
      }
      return NextResponse.json({ results });
    }

    // Single stotra
    const stotra = body as Stotra;
    if (!stotra.slug || !stotra.title || !stotra.titleEn) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, titleEn" },
        { status: 400 }
      );
    }

    saveStotra(stotra);
    return NextResponse.json({ success: true, slug: stotra.slug });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
