import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Unlock, Clock } from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { financials, inr } from "@/lib/merchant-data";

export const Route = createFileRoute("/financial-clarity")({
  head: () => ({
    meta: [
      { title: "Financial Clarity Layer — AI Merchant Growth Copilot" },
      { name: "description", content: "See exactly where your working capital sits: cash, credit, inventory and payables." },
      { property: "og:title", content: "Financial Clarity Layer — AI Merchant Growth Copilot" },
      { property: "og:description", content: "Where is my actual money? A clear view of working capital." },
    ],
  }),
  component: FinancialClarity,
});

const buckets = [
  {
    key: "cash",
    label: "Available Cash",
    value: financials.availableCash,
    status: "Liquid · usable now",
    icon: Unlock,
    bar: "bg-accent",
    tone: "text-accent",
  },
  {
    key: "credit",
    label: "Customer Credit",
    value: financials.customerCredit,
    status: "Locked · owed by customers",
    icon: Lock,
    bar: "bg-warn",
    tone: "text-warn",
  },
  {
    key: "inventory",
    label: "Inventory",
    value: financials.workingInventory,
    status: "Locked · converts on sale",
    icon: Lock,
    bar: "bg-foreground/35",
    tone: "text-muted-foreground",
  },
  {
    key: "pending",
    label: "Pending Payments",
    value: financials.pendingPayments,
    status: "Outgoing · due to suppliers",
    icon: Clock,
    bar: "bg-danger/70",
    tone: "text-danger",
  },
];

function FinancialClarity() {
  const total = buckets.reduce((s, b) => s + b.value, 0);
  const locked = financials.customerCredit + financials.workingInventory;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      <div className="animate-rise">
        <div className="eyebrow">Financial Clarity Layer</div>
        <h2 className="mt-1 font-display text-3xl font-black tracking-tight md:text-4xl">
          Where is my actual money?
        </h2>
        <p className="mt-2 max-w-[56ch] text-muted-foreground">
          Revenue is not cash. This shows how your {inr(total)} of working capital is split between what you
          can spend today and what is locked.
        </p>
      </div>

      {/* Money flow */}
      <Panel className="p-6 md:p-7" delay={80}>
        <div className="flex h-4 gap-1 overflow-hidden rounded-full ring-1 ring-edge/60">
          {buckets.map((b, i) => (
            <div
              key={b.key}
              className={`${b.bar} origin-left animate-grow`}
              style={{ width: `${(b.value / total) * 100}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {buckets.map((b, i) => (
            <div
              key={b.key}
              className="flex animate-rise items-center gap-4 rounded-xl bg-canvas/50 p-4 ring-1 ring-edge/50"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <div className={`grid size-10 shrink-0 place-items-center rounded-lg bg-panel ring-1 ring-edge/60 ${b.tone}`}>
                <b.icon className="size-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="eyebrow">{b.label}</div>
                <div className="font-display text-2xl font-extrabold tracking-tight">{inr(b.value)}</div>
                <div className={`text-[11px] ${b.tone}`}>{b.status}</div>
              </div>
              <div className="num text-[11px] text-muted-foreground">{Math.round((b.value / total) * 100)}%</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-edge/50 pt-5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Unlock className="size-4 text-accent" />
            <span>
              Usable today: <span className="num font-bold text-accent">{inr(financials.availableCash)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-warn" />
            <span>
              Locked: <span className="num font-bold text-warn">{inr(locked)}</span>
              <span className="text-muted-foreground"> ({Math.round((locked / total) * 100)}% of capital)</span>
            </span>
          </div>
        </div>
      </Panel>

      {/* AI explanation */}
      <Panel accent className="p-6 md:p-7" delay={200}>
        <div className="pointer-events-none absolute -right-10 -top-10 size-56 -rotate-12 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative">
          <AiBadge variant="inline" className="mb-3">
            AI explanation
          </AiBadge>
          <p className="max-w-[52ch] text-pretty text-[19px] font-medium leading-snug">
            Your revenue is healthy, but part of your working capital is locked in customer credit and inventory.
          </p>
          <p className="mt-3 max-w-[60ch] text-[13px] text-muted-foreground">
            Only {inr(financials.availableCash)} of {inr(total)} is spendable. Freeing even the{" "}
            {inr(financials.overdueCredit)} overdue credit would lift your restock budget by{" "}
            {Math.round((financials.overdueCredit / (financials.availableCash - financials.cashReserveTarget)) * 100)}%.
          </p>
          <Link
            to="/growth-blocker"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-display text-[13px] font-bold tracking-wide text-accent-foreground transition hover:brightness-110"
          >
            See what's blocking growth <ArrowRight className="size-4" />
          </Link>
        </div>
      </Panel>
    </div>
  );
}
