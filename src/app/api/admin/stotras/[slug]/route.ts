import { NextResponse } from "next/server";
import { getStotraBySlug, saveStotra, deleteStotra } from "@/lib/stotras";
import type { Stotra } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const stotra = getStotraBySlug(slug);
  if (!stotra) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(stotra);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = getStotraBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = (await request.json()) as Stotra;
    if (!body.slug || !body.title || !body.titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    body.updatedAt = new Date().toISOString();

    // If slug changed, delete old file
    if (body.slug !== slug) {
      deleteStotra(slug);
    }

    saveStotra(body);
    return NextResponse.json({ success: true, slug: body.slug });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = deleteStotra(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
