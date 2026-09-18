import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { AiBadge } from "@/components/app/AiBadge";
import { ActionButton } from "@/components/app/ActionButton";
import { whatIf, inr } from "@/lib/merchant-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/what-if")({
  head: () => ({
    meta: [
      { title: "Proactive What-If — AI Merchant Growth Copilot" },
      { name: "description", content: "AI spots expiring stock and compares two ways to reduce the loss before it happens." },
      { property: "og:title", content: "Proactive What-If — AI Merchant Growth Copilot" },
      { property: "og:description", content: "Compare discount vs bundle before stock expires." },
    ],
  }),
  component: WhatIf,
});

function WhatIf() {
  const [applied, setApplied] = useState(false);
  const best = whatIf.options.find((o) => o.recommended) ?? whatIf.options[0]!;
  const worst = whatIf.options.find((o) => !o.recommended) ?? best;
  const lossAvoided = best.revenue - worst.revenue;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      {/* Trigger */}
      <Panel accent className="p-6 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 size-56 -rotate-12 rounded-full bg-warn/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <AiBadge>Proactive alert</AiBadge>
            <h2 className="mt-4 flex items-center gap-3 font-display text-2xl font-black tracking-tight md:text-3xl">
              <AlertTriangle className="size-7 shrink-0 text-warn" strokeWidth={1.75} />
              {whatIf.trigger}
            </h2>
            <p className="mt-2 max-w-[52ch] text-muted-foreground">
              Detected from batch dates in your inventory. At full price you'd typically sell 6 and waste 4 —
              about <span className="num font-semibold text-foreground">₹180</span> lost.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-canvas/50 px-4 py-3 ring-1 ring-edge/50">
            <div className="eyebrow">Time left</div>
            <div className="num text-2xl font-bold text-warn">~18 hrs</div>
          </div>
        </div>
      </Panel>

      {/* AI question + comparison */}
      <Panel className="p-6 md:p-7" delay={100}>
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/30">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="eyebrow">Copilot asks</div>
            <p className="text-[17px] font-medium">{whatIf.question}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {whatIf.options.map((o, i) => (
            <div
              key={o.id}
              className={cn(
                "relative animate-rise rounded-xl p-5 ring-1",
                o.recommended ? "bg-accent/[.06] ring-accent/45" : "bg-canvas/50 ring-edge/50",
              )}
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              {o.recommended && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  AI recommends
                </span>
              )}
              <div className="eyebrow">Option {String.fromCharCode(65 + i)}</div>
              <div className="mt-1 font-display text-xl font-extrabold tracking-tight">{o.name}</div>
              <dl className="mt-4 flex flex-col divide-y divide-edge/50 text-[13px]">
                <Row label="Expected Sales" value={`${o.sales} packets`} />
                <Row label="Expected Revenue" value={inr(o.revenue)} strong />
                <Row
                  label="Expected Waste"
                  value={`${o.waste} packets`}
                  tone={o.waste === 0 ? "text-accent" : "text-danger"}
                />
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl bg-canvas/50 p-5 ring-1 ring-edge/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[13px]">
            <AiBadge variant="inline" className="mb-1">
              Why the bundle
            </AiBadge>
            <p className="text-pretty text-muted-foreground">
              Bread is already your #2 basket pairing with milk. The bundle earns{" "}
              <span className="num font-semibold text-foreground">{inr(lossAvoided)}</span> more than the
              discount and leaves zero waste.
            </p>
          </div>
          {applied ? (
            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-success/15 px-4 py-2.5 text-[13px] font-semibold text-success ring-1 ring-success/40">
              <Check className="size-4 animate-check" /> Bundle campaign created successfully.
            </div>
          ) : (
            <ActionButton
              variant="primary"
              size="lg"
              successMessage="Bundle campaign created successfully."
              successDescription={`${best.name} · live at counter and on WhatsApp catalogue.`}
              onDone={() => setApplied(true)}
            >
              Apply Bundle
            </ActionButton>
          )}
        </div>
      </Panel>
    </div>
  );
}

function Row({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("num font-semibold", strong && "text-base font-bold", tone)}>{value}</dd>
    </div>
  );
}
