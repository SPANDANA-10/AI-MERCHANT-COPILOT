import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Panel, Stat } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { ActionButton } from "@/components/app/ActionButton";
import { financials, salesTrend, topProducts, recommendedActions, inr } from "@/lib/merchant-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Merchant Growth Copilot" },
      {
        name: "description",
        content: "Your kirana store at a glance: cash, credit, inventory and today's AI recommended actions.",
      },
      { property: "og:title", content: "Dashboard — AI Merchant Growth Copilot" },
      { property: "og:description", content: "Cash, credit, inventory and AI actions for your kirana store." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const max = Math.max(...salesTrend.map((d) => d.value));
  const f = financials;
  const total = f.availableCash + f.customerCredit + f.workingInventory + f.pendingPayments;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

  return (
    <div className="flex flex-col gap-7">
      {/* AI Growth Insight — hero */}
      <Panel accent className="p-6 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 size-64 -rotate-12 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row">
          <div className="max-w-[52ch]">
            <AiBadge variant="inline" className="mb-3">
              AI growth insight
            </AiBadge>
            <p className="text-pretty text-[20px] font-medium leading-snug md:text-[22px]">
              Your sales are growing{" "}
              <span className="font-display font-extrabold text-accent">{f.salesGrowthPct}%</span>, but{" "}
              <span className="num font-bold">{inr(f.customerCredit)}</span> is stuck in customer credit.
              This is limiting your ability to restock your fastest-selling products.
            </p>
            <Link
              to="/growth-blocker"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-display text-[13px] font-bold tracking-wide text-accent-foreground transition hover:brightness-110"
            >
              See Recommended Actions <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="w-full shrink-0 lg:w-56">
            <div className="eyebrow mb-2">Sales trend · 7 days</div>
            <div className="flex h-20 items-end gap-1.5">
              {salesTrend.map((d, i) => (
                <div
                  key={d.day}
                  title={`${d.day}: ${inr(d.value)}`}
                  className={`flex-1 origin-bottom animate-grow rounded-t ${i === salesTrend.length - 1 ? "bg-accent" : "bg-edge/70"}`}
                  style={{ height: `${(d.value / max) * 100}%`, animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
            <div className="num mt-1.5 text-[10px] text-muted-foreground">
              +{f.salesGrowthPct}% vs last week
            </div>
          </div>
        </div>
      </Panel>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Available cash" value={inr(f.availableCash)} note="₹800 reserve kept" tone="accent" />
        <Stat label="Inventory value" value={inr(f.inventoryValue)} note="4 fast movers low" delay={60} />
        <Stat label="Customer credit" value={inr(f.customerCredit)} note="₹800 overdue" tone="warn" delay={120} />
        <Stat label="Pending payments" value={inr(f.pendingPayments)} note="Due in 5 days" delay={180} />
        <Stat label="Today's sales" value={inr(f.todaysSales)} note="142 items sold" tone="accent" delay={240} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI recommended actions */}
        <Panel className="p-6" delay={200}>
          <div className="mb-5 flex items-center justify-between">
            <AiBadge variant="inline">AI recommended actions</AiBadge>
            <span className="num text-[10px] text-muted-foreground">{recommendedActions.length} today</span>
          </div>
          <div className="flex flex-col divide-y divide-edge/50">
            {recommendedActions.map((a) => (
              <div key={a.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-24 shrink-0">
                  <div className="font-display text-[15px] font-bold">{a.headline}</div>
                  <div className="text-[10px] uppercase tracking-[.14em] text-muted-foreground">{a.tag}</div>
                </div>
                <div className="flex-1 text-pretty text-[13px]">{a.reason}</div>
                <ActionButton successMessage={a.successMessage} successDescription={a.impact}>
                  {a.cta}
                </ActionButton>
              </div>
            ))}
          </div>
          <Link
            to="/action-copilot"
            className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-accent hover:underline"
          >
            Open Action Copilot <ArrowRight className="size-3.5" />
          </Link>
        </Panel>

        <div className="flex flex-col gap-6">
          {/* Top products */}
          <Panel className="p-6" delay={260}>
            <div className="eyebrow mb-4">Top selling products</div>
            <div className="flex flex-col divide-y divide-edge/50">
              {topProducts.map((p) => (
                <div key={p.rank} className="flex items-center gap-3 py-2.5">
                  <span className="num w-6 text-[11px] text-muted-foreground">
                    {String(p.rank).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
                    {p.velocity}
                  </span>
                  <span className="num font-bold">{inr(p.revenue)}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Cash position */}
          <Panel className="p-6" delay={320}>
            <div className="pointer-events-none absolute -bottom-8 -right-8 size-44 -rotate-12 bg-accent/[.08]" />
            <div className="mb-3 flex items-center justify-between">
              <div className="eyebrow">Cash position</div>
              <Link to="/financial-clarity" className="text-[11px] font-semibold text-accent hover:underline">
                Where is my money?
              </Link>
            </div>
            <div className="flex h-3 gap-1 overflow-hidden rounded-full ring-1 ring-edge/60">
              <div className="bg-accent" style={{ width: pct(f.availableCash) }} />
              <div className="bg-warn" style={{ width: pct(f.customerCredit) }} />
              <div className="bg-foreground/25" style={{ width: pct(f.workingInventory) }} />
              <div className="bg-foreground/10" style={{ width: pct(f.pendingPayments) }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
              <Legend color="bg-accent" label={`Cash ${inr(f.availableCash)}`} />
              <Legend color="bg-warn" label={`Credit ${inr(f.customerCredit)}`} />
              <Legend color="bg-foreground/30" label={`Inventory ${inr(f.workingInventory)}`} />
              <Legend color="bg-foreground/15" label={`Payable ${inr(f.pendingPayments)}`} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
