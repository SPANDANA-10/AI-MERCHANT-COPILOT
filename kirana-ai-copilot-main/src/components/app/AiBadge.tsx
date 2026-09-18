import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent "this came from the AI" indicator. */
export function AiBadge({
  children,
  variant = "pill",
  className,
}: {
  children: ReactNode;
  variant?: "pill" | "inline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-accent",
        variant === "pill" && "rounded-full bg-accent/10 px-2.5 py-1 ring-1 ring-accent/40",
        className,
      )}
    >
      <span className="size-1.5 animate-ai-pulse rounded-full bg-accent" />
      {children}
    </span>
  );
}
