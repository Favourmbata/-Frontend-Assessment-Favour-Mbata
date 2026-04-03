import { formatStatName } from "@/lib/utils/format";

interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

export function StatBar({ name, value, max = 255 }: StatBarProps) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs font-semibold text-gray-500 shrink-0">
        {formatStatName(name)}
      </span>
      <span className="w-8 text-sm font-bold text-gray-800 text-right shrink-0">
        {value}
      </span>
      <div
        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${formatStatName(name)}: ${value}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
