import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutGrid,
  Wallet,
  ShieldAlert,
  GitCompare,
  Zap,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { merchant, financials, inr } from "@/lib/merchant-data";
import { AiBadge } from "./AiBadge";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/financial-clarity", label: "Financial Clarity", icon: Wallet },
  { to: "/growth-blocker", label: "Growth Blocker AI", icon: ShieldAlert },
  { to: "/what-if", label: "Proactive What-If", icon: GitCompare },
  { to: "/action-copilot", label: "Action Copilot", icon: Zap },
  { to: "/restock", label: "Cash-Constrained Restock", icon: ShoppingCart },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const reservePct = Math.round((financials.cashReserveTarget / financials.availableCash) * 100);
  return (
    <>
      <div className="flex items-center gap-2.5">
        <div className="grid size-9 place-items-center rounded-lg bg-accent/15 font-display text-base font-black text-accent ring-1 ring-accent/40">
          K
        </div>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-extrabold tracking-tight">Kirana Copilot</div>
          <div className="eyebrow">Growth OS</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-panel hover:text-foreground"
            activeProps={{
              className:
                "flex items-center gap-2.5 rounded-lg px-3 py-2 bg-accent/10 ring-1 ring-accent/30 text-accent font-semibold",
            }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-xl bg-panel p-4 ring-1 ring-edge/60">
        <div className="eyebrow mb-2">Cash reserve</div>
        <div className="num text-2xl font-bold">{inr(financials.cashReserveTarget)}</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-edge/50">
          <div className="h-full bg-warn" style={{ width: `${reservePct}%` }} />
        </div>
        <div className="mt-1.5 text-[10px] text-muted-foreground">
          {reservePct}% of available cash protected
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => n.to === pathname)?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-canvas text-sm text-foreground">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 animate-slide flex-col gap-8 border-r border-edge/60 p-5 lg:flex">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 animate-slide flex-col gap-8 border-r border-edge/60 bg-canvas p-5">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="relative min-w-0 flex-1 overflow-clip">
        <div className="ambient-glow -left-24 -top-40 h-[620px] w-[420px]" />
        <div className="ambient-glow -right-32 top-40 h-[560px] w-[380px] opacity-60" />

        <header className="relative flex items-center justify-between border-b border-edge/60 px-5 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-3">
            <button
              className="grid size-9 place-items-center rounded-lg ring-1 ring-edge/70 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div>
              <div className="eyebrow">
                {current} · {merchant.location}
              </div>
              <h1 className="font-display text-xl font-black tracking-tight md:text-[26px]">
                {pathname === "/" ? `Good morning, ${merchant.name}` : current}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AiBadge>AI live</AiBadge>
            <span className="hidden rounded-lg px-3 py-1.5 text-muted-foreground ring-1 ring-edge/70 sm:inline">
              ₹ INR
            </span>
          </div>
        </header>

        <div className="relative px-5 py-6 md:px-8 md:py-7">{children}</div>
      </main>
    </div>
  );
}
