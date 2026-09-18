import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Package, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { ActionButton } from "@/components/app/ActionButton";
import { recommendedActions, type ActionKind } from "@/lib/merchant-data";

export const Route = createFileRoute("/action-copilot")({
  head: () => ({
    meta: [
      { title: "Action Copilot — AI Merchant Growth Copilot" },
      { name: "description", content: "Today's AI recommended actions for your store, executable in one tap." },
      { property: "og:title", content: "Action Copilot — AI Merchant Growth Copilot" },
      { property: "og:description", content: "3 AI actions recommended today. Execute in one tap." },
    ],
  }),
  component: ActionCopilot,
});

const icons: Record<ActionKind, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  bundle: Package,
  "purchase-order": ShoppingCart,
};

function ActionCopilot() {
  const [done, setDone] = useState<string[]>([]);
  const remaining = recommendedActions.length - done.length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      <Panel accent className="p-6 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 size-56 -rotate-12 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <AiBadge>Action center</AiBadge>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight md:text-4xl">
              {remaining === 0 ? "All actions completed" : `${remaining} AI action${remaining === 1 ? "" : "s"} recommended today`}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {remaining === 0
                ? "Nice work. Copilot will surface new actions as your data changes."
                : "Each action is ranked by cash impact and urgency. Tap to execute."}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {recommendedActions.map((a) => (
              <div
                key={a.id}
                className={`h-1.5 w-10 rounded-full transition ${done.includes(a.id) ? "bg-accent" : "bg-edge/70"}`}
              />
            ))}
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        {recommendedActions.map((a, i) => {
          const Icon = icons[a.kind];
          const isDone = done.includes(a.id);
          return (
            <Panel key={a.id} className={`p-5 md:p-6 ${isDone ? "opacity-70" : ""}`} delay={100 + i * 80}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div
                  className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${
                    isDone ? "bg-success/15 text-success ring-success/40" : "bg-accent/10 text-accent ring-accent/30"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="size-5 animate-check" /> : <Icon className="size-5" strokeWidth={1.75} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow">Action {i + 1}</span>
                    <span className="rounded-full bg-canvas/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-edge/60">
                      {a.tag}
                    </span>
                    <span className="num text-[10px] text-accent">{a.impact}</span>
                  </div>
                  <div className="mt-1 font-display text-lg font-bold tracking-tight">{a.title}</div>
                  <p className="text-[13px] text-muted-foreground">{a.reason}</p>
                </div>
                <ActionButton
                  variant={i === 0 ? "primary" : "outline"}
                  successMessage={a.successMessage}
                  successDescription={a.impact}
                  onDone={() => setDone((d) => [...d, a.id])}
                >
                  {a.cta}
                </ActionButton>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
