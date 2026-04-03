import { getTypeColor } from "@/lib/utils/typeColors";
import { formatName } from "@/lib/utils/format";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const colorClass = getTypeColor(type);
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-block rounded-full font-semibold capitalize ${colorClass} ${sizeClass}`}
    >
      {formatName(type)}
    </span>
  );
}
