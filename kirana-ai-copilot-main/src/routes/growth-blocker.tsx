import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { ActionButton } from "@/components/app/ActionButton";
import { financials, inr } from "@/lib/merchant-data";

export const Route = createFileRoute("/growth-blocker")({
  head: () => ({
    meta: [
      { title: "Growth Blocker AI — AI Merchant Growth Copilot" },
      { name: "description", content: "AI diagnosis of the single biggest thing holding back your store's growth, with a 3-step action plan." },
      { property: "og:title", content: "Growth Blocker AI — AI Merchant Growth Copilot" },
      { property: "og:description", content: "Your biggest growth blocker, diagnosed and solved in 3 steps." },
    ],
  }),
  component: GrowthBlocker,
});

function GrowthBlocker() {
  const f = financials;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      {/* Diagnosis */}
      <Panel accent className="p-6 md:p-8" delay={0}>
        <div className="pointer-events-none absolute -right-12 -top-12 size-72 -rotate-12 rounded-full bg-warn/10 blur-3xl" />
        <div className="relative">
          <AiBadge>AI diagnosis · 92% confidence</AiBadge>
          <div className="eyebrow mt-5">Your Biggest Growth Blocker</div>
          <h2 className="mt-1 flex items-center gap-3 font-display text-3xl font-black tracking-tight md:text-4xl">
            <ShieldAlert className="size-8 shrink-0 text-warn" strokeWidth={1.75} />
            Cash locked in customer credit
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Fact label="Customer credit" value={inr(f.customerCredit)} tone="text-warn" />
            <Fact label="Overdue" value={inr(f.overdueCredit)} tone="text-danger" note="12+ days late" />
            <Fact label="Fast movers" value="3 SKUs" note="need restock now" />
          </div>

          <div className="mt-6 rounded-xl bg-canvas/50 p-5 ring-1 ring-edge/50">
            <div className="eyebrow mb-2">Why this blocks growth</div>
            <p className="text-pretty text-[14px] leading-relaxed">
              Sales are up {f.salesGrowthPct}%, so demand for Oil, Milk and Rice is rising. But{" "}
              <span className="num font-bold text-warn">{inr(f.customerCredit)}</span> of your money is sitting
              with customers instead of on your shelves. With only{" "}
              <span className="num font-bold text-accent">{inr(f.availableCash)}</span> in hand, you can't
              fully restock fast movers — so you lose sales you've already earned the demand for.
            </p>
          </div>
        </div>
      </Panel>

      {/* Action plan */}
      <Panel className="p-6 md:p-7" delay={120}>
        <div className="mb-5 flex items-center justify-between">
          <AiBadge variant="inline">AI action plan</AiBadge>
          <span className="num text-[10px] text-muted-foreground">3 steps · frees ₹800 today</span>
        </div>
        <ol className="flex flex-col divide-y divide-edge/50">
          <Step
            n={1}
            title={`Collect ${inr(f.overdueCredit)} overdue payment`}
            detail="Sunita Sharma · 12 days late. A polite WhatsApp reminder recovers 80% of overdue credit within 2 days."
            action={
              <ActionButton
                successMessage="WhatsApp reminder sent to Sunita Sharma."
                successDescription="Payment link for ₹800 included."
                doneLabel="Reminder sent"
              >
                Send WhatsApp Reminder
              </ActionButton>
            }
          />
          <Step
            n={2}
            title="Prioritize fast-moving inventory"
            detail="Spend on Oil, Milk and Rice first. Skip Biscuits until cash improves."
            action={
              <Link
                to="/restock"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent/10 px-3.5 py-2 text-[12px] font-semibold text-accent ring-1 ring-accent/45 transition hover:bg-accent/20"
              >
                View Smart Restock <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <Step
            n={3}
            title={`Preserve ${inr(f.cashReserveTarget)} cash reserve`}
            detail="Keep a buffer for daily expenses and supplier dues so the next week isn't cash-tight."
            action={
              <ActionButton
                variant="primary"
                successMessage="Growth plan applied."
                successDescription="₹800 reserve locked · restock budget set to ₹4,200."
                doneLabel="Plan applied"
              >
                Apply Plan
              </ActionButton>
            }
          />
        </ol>
      </Panel>
    </div>
  );
}

function Fact({ label, value, tone = "", note }: { label: string; value: string; tone?: string; note?: string }) {
  return (
    <div className="rounded-xl bg-canvas/50 p-4 ring-1 ring-edge/50">
      <div className="eyebrow">{label}</div>
      <div className={`mt-1 font-display text-2xl font-extrabold tracking-tight ${tone}`}>{value}</div>
      {note && <div className="text-[11px] text-muted-foreground">{note}</div>}
    </div>
  );
}

function Step({ n, title, detail, action }: { n: number; title: string; detail: string; action: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/10 font-display text-sm font-black text-accent ring-1 ring-accent/30">
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-[12px] text-muted-foreground">{detail}</div>
      </div>
      {action}
    </li>
  );
}
