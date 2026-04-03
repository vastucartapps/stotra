import Image from "next/image";
import { DEITIES } from "@/data/deities";
import { PURPOSES } from "@/data/purposes";

type CategoryType = "deity" | "purpose" | "day" | "festival";

interface CategoryIconProps {
  type: CategoryType;
  id: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: { container: "w-8 h-8", icon: 20 },
  md: { container: "w-12 h-12", icon: 28 },
  lg: { container: "w-14 h-14", icon: 32 },
  xl: { container: "w-16 h-16", icon: 38 },
} as const;

const FOLDER_MAP: Record<CategoryType, string> = {
  deity: "/images/deities",
  purpose: "/images/purposes",
  day: "/images/days",
  festival: "/images/festivals",
};

const DAY_ALT: Record<string, string> = {
  sunday: "Sunday (Ravivar) — sacred to Surya Dev, the Sun god",
  monday: "Monday (Somvar) — sacred to Lord Shiva",
  tuesday: "Tuesday (Mangalvar) — sacred to Lord Hanuman",
  wednesday: "Wednesday (Budhvar) — sacred to Lord Ganesha",
  thursday: "Thursday (Guruvar) — sacred to Lord Vishnu and Brihaspati",
  friday: "Friday (Shukravar) — sacred to Goddess Lakshmi",
  saturday: "Saturday (Shanivar) — sacred to Shani Dev",
};

function getAltText(type: CategoryType, id: string): string {
  switch (type) {
    case "deity": {
      const deity = DEITIES.find((d) => d.id === id);
      if (deity) {
        const shortDesc = deity.description.split(".")[0];
        return `${deity.name} — ${shortDesc.charAt(0).toLowerCase()}${shortDesc.slice(1)}`;
      }
      return `Hindu deity icon`;
    }
    case "purpose": {
      const purpose = PURPOSES.find((p) => p.id === id);
      if (purpose) {
        return `${purpose.name} — Hindu stotras for ${purpose.nameHi}`;
      }
      return `Hindu prayer purpose icon`;
    }
    case "day":
      return DAY_ALT[id] || `${id} — Hindu day of worship`;
    case "festival":
      return `${id.replace(/-/g, " ")} — Hindu festival`;
    default:
      return "";
  }
}

export function CategoryIcon({
  type,
  id,
  color,
  size = "md",
  className = "",
}: CategoryIconProps) {
  const { container, icon } = SIZE_MAP[size];
  const src = `${FOLDER_MAP[type]}/${id}.svg`;
  const alt = getAltText(type, id);

  return (
    <span
      className={`${container} rounded-xl flex items-center justify-center flex-shrink-0 ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={icon}
        height={icon}
        className="select-none"
        style={{ filter: color ? "brightness(0) invert(1)" : undefined }}
      />
    </span>
  );
}
