import { useState, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:brightness-110",
  outline: "bg-accent/10 text-accent ring-1 ring-accent/45 hover:bg-accent/20",
  ghost: "text-muted-foreground ring-1 ring-edge/70 hover:bg-panel hover:text-foreground",
};

/**
 * CTA that simulates an async action: idle → loading → done.
 * Fires a success toast and locks into a done state.
 */
export function ActionButton({
  children,
  doneLabel,
  successMessage,
  successDescription,
  variant = "outline",
  size = "md",
  className,
  onDone,
  delay = 900,
}: {
  children: ReactNode;
  doneLabel?: string;
  successMessage: string;
  successDescription?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  onDone?: () => void;
  delay?: number;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const run = () => {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      setState("done");
      toast.success(successMessage, { description: successDescription });
      onDone?.();
    }, delay);
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-3.5 py-2 text-[12px]",
    lg: "px-5 py-2.5 text-[13px] font-display tracking-wide",
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={state !== "idle"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-default",
        sizes[size],
        state === "done"
          ? "bg-success/15 text-success ring-1 ring-success/40"
          : variants[variant],
        state === "loading" && "opacity-80",
        className,
      )}
    >
      {state === "loading" && <Loader2 className="size-3.5 animate-spin" />}
      {state === "done" && <Check className="size-3.5 animate-check" />}
      {state === "done" ? (doneLabel ?? "Done") : children}
    </button>
  );
}
