import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { ActionButton } from "@/components/app/ActionButton";
import { financials, restockCandidates, planRestock, inr } from "@/lib/merchant-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restock")({
  head: () => ({
    meta: [
      { title: "Cash-Constrained Restock — AI Merchant Growth Copilot" },
      { name: "description", content: "AI builds a purchase plan that never exceeds your available cash while covering fast-moving products." },
      { property: "og:title", content: "Cash-Constrained Restock — AI Merchant Growth Copilot" },
      { property: "og:description", content: "Smart restock that respects your cash." },
    ],
  }),
  component: Restock,
});

const priorityStyle = {
  High: "bg-danger/15 text-danger ring-danger/40",
  Medium: "bg-warn/15 text-warn ring-warn/40",
  Low: "bg-edge/40 text-muted-foreground ring-edge/70",
};

function Restock() {
  const [generated, setGenerated] = useState(false);
  const plan = planRestock(restockCandidates, financials.availableCash, financials.cashReserveTarget);
  const selectedIds = new Set(plan.selected.map((s) => s.id));
  const totalNeed = restockCandidates.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="flex flex-col gap-7">
      {/* Constraint header */}
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="rounded-xl p-5">
          <div className="eyebrow">Available cash</div>
          <div className="mt-1 font-display text-3xl font-extrabold tracking-tight text-accent">
            {inr(financials.availableCash)}
          </div>
          <div className="text-[11px] text-muted-foreground">Hard ceiling for this plan</div>
        </Panel>
        <Panel className="rounded-xl p-5" delay={60}>
          <div className="eyebrow">Total restock demand</div>
          <div className="mt-1 font-display text-3xl font-extrabold tracking-tight">{inr(totalNeed)}</div>
          <div className="text-[11px] text-warn">
            {inr(totalNeed - financials.availableCash)} more than you have
          </div>
        </Panel>
        <Panel className="rounded-xl p-5" delay={120}>
          <div className="eyebrow">Protected reserve</div>
          <div className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            {inr(financials.cashReserveTarget)}
          </div>
          <div className="text-[11px] text-muted-foreground">Never spent by the AI</div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Product list */}
        <Panel className="p-6" delay={160}>
          <div className="mb-4 flex items-center justify-between">
            <div className="eyebrow">Products needing restock</div>
            <span className="num text-[10px] text-muted-foreground">{restockCandidates.length} items</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {restockCandidates.map((item, i) => {
              const inPlan = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex animate-rise items-center gap-3 rounded-xl p-3.5 ring-1 transition",
                    inPlan ? "bg-canvas/50 ring-edge/60" : "bg-canvas/20 ring-edge/30 opacity-60",
                  )}
                  style={{ animationDelay: `${200 + i * 60}ms` }}
                >
                  <div
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-md ring-1",
                      inPlan ? "bg-accent text-accent-foreground ring-accent" : "ring-edge/70",
                    )}
                  >
                    {inPlan && <Check className="size-3.5" strokeWidth={3} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Need {item.need} · sells {item.velocity}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 sm:inline",
                      priorityStyle[item.priority],
                    )}
                  >
                    {item.priority}
                  </span>
                  <div className={cn("num font-bold", !inPlan && "line-through")}>{inr(item.cost)}</div>
                </div>
              );
            })}
          </div>
          {plan.skipped.length > 0 && (
            <p className="mt-4 text-[12px] text-muted-foreground">
              Deferred: {plan.skipped.map((s) => s.name).join(", ")} — low priority and would exceed your cash ceiling.
            </p>
          )}
        </Panel>

        {/* AI plan */}
        <Panel accent className="flex flex-col p-6" delay={240}>
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 -rotate-12 bg-accent/[.08]" />
          <div className="relative flex flex-1 flex-col">
            <AiBadge variant="inline">AI purchase plan</AiBadge>
            <div className="eyebrow mt-4">Recommended purchase</div>
            <div className="font-display text-4xl font-extrabold tracking-tight">{inr(plan.total)}</div>

            <dl className="mt-4 flex flex-col divide-y divide-edge/50 text-[13px]">
              {plan.selected.map((s) => (
                <div key={s.id} className="flex justify-between py-2">
                  <dt className="text-muted-foreground">{s.name}</dt>
                  <dd className="num font-semibold">{inr(s.cost)}</dd>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <dt className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="size-4 text-accent" /> Cash remaining
                </dt>
                <dd className="num font-bold text-accent">{inr(plan.remaining)}</dd>
              </div>
            </dl>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-edge/50 ring-1 ring-edge/60">
              <div
                className="h-full origin-left animate-grow bg-accent"
                style={{ width: `${(plan.total / financials.availableCash) * 100}%` }}
              />
            </div>
            <div className="num mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>{Math.round((plan.total / financials.availableCash) * 100)}% of cash used</span>
              <span>ceiling {inr(financials.availableCash)}</span>
            </div>

            <p className="mt-4 text-pretty text-[13px] text-muted-foreground">
              Based on available liquidity, sales velocity and product priority, this purchase plan covers urgent
              fast-moving products while preserving {inr(plan.remaining)} cash.
            </p>

            <div className="mt-auto pt-5">
              {generated ? (
                <div className="flex items-center gap-2 rounded-lg bg-success/15 px-4 py-2.5 text-[13px] font-semibold text-success ring-1 ring-success/40">
                  <Check className="size-4 animate-check" /> Purchase order generated.
                </div>
              ) : (
                <ActionButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  successMessage="Purchase order generated."
                  successDescription={`PO-2041 · ${inr(plan.total)} · sent to Mahavir Distributors.`}
                  onDone={() => setGenerated(true)}
                >
                  Generate Purchase Order
                </ActionButton>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
