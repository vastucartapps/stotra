import Image from "next/image";

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

export function CategoryIcon({
  type,
  id,
  color,
  size = "md",
  className = "",
}: CategoryIconProps) {
  const { container, icon } = SIZE_MAP[size];
  const src = `${FOLDER_MAP[type]}/${id}.svg`;

  return (
    <span
      className={`${container} rounded-xl flex items-center justify-center flex-shrink-0 ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      <Image
        src={src}
        alt=""
        width={icon}
        height={icon}
        className="select-none"
        style={{ filter: color ? "brightness(0) invert(1)" : undefined }}
        aria-hidden="true"
      />
    </span>
  );
}
