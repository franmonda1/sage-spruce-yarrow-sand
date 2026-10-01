import { numberGlyphs, spokenNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";

const placeClass: Record<"units" | "tens" | "hundreds" | "sep", string> = {
  units: "num-units",
  tens: "num-tens",
  hundreds: "num-hundreds",
  sep: "num-sep",
};

export function ColoredNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const glyphs = numberGlyphs(value);
  return (
    <span
      className={cn("num-face", className)}
      aria-label={spokenNumber(value)}
    >
      {glyphs.map((g, i) => (
        <span key={`${g.ch}-${i}`} className={placeClass[g.place]} aria-hidden="true">
          {g.ch}
        </span>
      ))}
    </span>
  );
}
