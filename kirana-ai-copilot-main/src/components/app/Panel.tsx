import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  accent = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <section
      className={cn(
        "relative animate-rise overflow-clip",
        accent ? "glass-panel-accent" : "glass-panel",
        className,
      )}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  note,
  tone = "muted",
  delay = 0,
}: {
  label: string;
  value: string;
  note?: string;
  tone?: "accent" | "warn" | "muted";
  delay?: number;
}) {
  const tones = { accent: "text-accent", warn: "text-warn", muted: "text-muted-foreground" };
  return (
    <Panel className="rounded-xl p-4" delay={delay}>
      <div className="eyebrow">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold tracking-tight">{value}</div>
      {note && <div className={cn("mt-1 text-[11px] font-medium", tones[tone])}>{note}</div>}
    </Panel>
  );
}
