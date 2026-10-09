import { NextResponse } from "next/server";
import { getAllStotras, toStotraCard } from "@/lib/stotras";
import { DEITIES } from "@/data/deities";
import { filterStotras, parseSearchParams } from "@/lib/stotra-search";

const DEITY_IDS = DEITIES.map((d) => d.id);

export function GET(request: Request) {
  const { q, deity, offset, limit } = parseSearchParams(new URL(request.url).searchParams, DEITY_IDS);
  const matches = filterStotras(getAllStotras(), q, deity);
  return NextResponse.json(
    { total: matches.length, results: matches.slice(offset, offset + limit).map(toStotraCard) },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
