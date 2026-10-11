/**
 * Upcoming festivals for the festival hub. Dates come only from the astroengine
 * festivals endpoint (GET /api/v1/panchang/festivals); nothing is computed or
 * invented here. Dependency-free so it can be unit-tested under plain node.
 */

/** astroengine festival key -> festival id in src/data/festivals.ts. Unmapped keys are skipped. */
export const KEY_TO_FESTIVAL: Record<string, string> = {
  vasant_panchami: "vasant-panchami",
  maha_shivaratri: "maha-shivaratri",
  holika_dahan: "holika-dahan",
  holi: "holi",
  rama_navami: "ram-navami",
  hanuman_jayanti: "hanuman-jayanti",
  akshaya_tritiya: "akshaya-tritiya",
  guru_purnima: "guru-purnima",
  nag_panchami: "nag-panchami",
  raksha_bandhan: "raksha-bandhan",
  krishna_janmashtami: "janmashtami",
  ganesh_chaturthi: "ganesh-chaturthi",
  anant_chaturdashi: "anant-chaturdashi",
  navratri_start: "navratri",
  chaitra_navratri_start: "navratri",
  dussehra: "dussehra",
  sharad_purnima: "sharad-purnima",
  karwa_chauth: "karva-chauth",
  dhanteras: "dhanteras",
  diwali: "diwali",
  govardhan_puja: "govardhan-puja",
  chhath_puja: "chhath-puja",
  kartik_purnima: "kartik-purnima",
  gita_jayanti: "gita-jayanti",
  makar_sankranti: "makar-sankranti",
  vat_savitri: "vat-savitri",
};

export interface UpcomingFestival {
  key: string;
  name: string;
  nameHi?: string;
  festivalId: string;
  /** YYYY-MM-DD, as reported by the astroengine. */
  date: string;
  /** Present only when the engine reports a different Vaishnav date. */
  vaishnavDate?: string;
}

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function festivalIdFor(key: string): string | null {
  if (KEY_TO_FESTIVAL[key]) return KEY_TO_FESTIVAL[key];
  // Named ekadashis come as ekadashi_<month>_<paksha>.
  return key.startsWith("ekadashi_") ? "ekadashi" : null;
}

export function buildUpcoming(data: unknown, today: string, limit: number): UpcomingFestival[] {
  const list = obj(data)?.festivals;
  if (!Array.isArray(list)) return [];
  const rows: UpcomingFestival[] = [];
  for (const item of list) {
    const o = obj(item);
    const key = str(o?.key);
    const name = str(o?.name);
    const date = str(o?.date_standard);
    if (!o || !key || !name || !date || !ISO.test(date) || date < today) continue;
    const festivalId = festivalIdFor(key);
    if (!festivalId) continue;
    const vaishnav = str(o.date_vaishnav);
    rows.push({
      key,
      name,
      nameHi: str(o.name_hindi) ?? undefined,
      festivalId,
      date,
      vaishnavDate: vaishnav && ISO.test(vaishnav) && vaishnav !== date ? vaishnav : undefined,
    });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows.slice(0, limit);
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-20" -> "Tue, 20 Oct 2026" without any timezone shift. */
export function formatFestivalDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[dow]}, ${d} ${MONTHS[m - 1]} ${y}`;
}
