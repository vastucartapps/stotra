import { buildUpcoming, type UpcomingFestival } from "@/lib/festival-calendar";

const API_URL = process.env.ASTROENGINE_API_URL || "https://api.vastucart.in";
const API_KEY = process.env.ASTROENGINE_API_KEY || "";
const WINDOW_DAYS = 90;

function istToday(): string {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return p; // en-CA formats as YYYY-MM-DD
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Next festivals from the astroengine (New Delhi, IST), or [] if the key is missing or the engine is down. */
export async function getUpcomingFestivals(limit = 8): Promise<UpcomingFestival[]> {
  if (!API_KEY) return [];
  const today = istToday();
  try {
    const url = `${API_URL}/api/v1/panchang/festivals?start_date=${today}&end_date=${addDays(today, WINDOW_DAYS)}`;
    const res = await fetch(url, {
      headers: { "X-API-Key": API_KEY },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: unknown } | null;
    return buildUpcoming(json && typeof json === "object" && "data" in json && json.data ? json.data : json, today, limit);
  } catch {
    return [];
  }
}
