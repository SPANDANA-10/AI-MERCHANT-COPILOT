/**
 * Mock merchant data layer.
 * Shaped so a backend (Lovable Cloud) can replace these constants with
 * fetched data later without touching the UI components.
 */

export const merchant = {
  name: "Ramesh",
  shop: "Sharma Kirana Store",
  location: "Shop No. 42, Indore",
};

export const financials = {
  availableCash: 5000,
  inventoryValue: 12000,
  customerCredit: 3000,
  overdueCredit: 800,
  pendingPayments: 2000,
  todaysSales: 2450,
  salesGrowthPct: 18,
  cashReserveTarget: 800,
  /** Financial clarity uses working-capital inventory (fast movers) */
  workingInventory: 4000,
};

export const salesTrend = [
  { day: "Fri", value: 1650 },
  { day: "Sat", value: 1980 },
  { day: "Sun", value: 1720 },
  { day: "Mon", value: 2050 },
  { day: "Tue", value: 2180 },
  { day: "Wed", value: 2120 },
  { day: "Thu", value: 2450 },
];

export const topProducts = [
  { rank: 1, name: "Amul Taaza Milk 500ml", revenue: 640, velocity: "High" },
  { rank: 2, name: "Fortune Sunflower Oil 1L", revenue: 520, velocity: "High" },
  { rank: 3, name: "Parle-G Gold Biscuit", revenue: 310, velocity: "Medium" },
  { rank: 4, name: "India Gate Basmati 5kg", revenue: 280, velocity: "Medium" },
];

export type ActionKind = "whatsapp" | "bundle" | "purchase-order";

export interface RecommendedAction {
  id: string;
  kind: ActionKind;
  headline: string;
  tag: string;
  title: string;
  reason: string;
  cta: string;
  successMessage: string;
  impact: string;
}

export const recommendedActions: RecommendedAction[] = [
  {
    id: "collect-overdue",
    kind: "whatsapp",
    headline: "₹800",
    tag: "Overdue",
    title: "₹800 overdue customer payment",
    reason: "Sunita Sharma owes ₹800 — 12 days late. Collecting restores restock cash today.",
    cta: "Send WhatsApp Reminder",
    successMessage: "WhatsApp reminder sent to Sunita Sharma.",
    impact: "+₹800 cash",
  },
  {
    id: "milk-expiry",
    kind: "bundle",
    headline: "10 milk",
    tag: "Expiring",
    title: "10 milk packets expiring tomorrow",
    reason: "Amul pouches expire tomorrow. Bundling with bread clears all 10 at ₹420 with zero waste.",
    cta: "Create Bundle Offer",
    successMessage: "Bundle campaign created successfully.",
    impact: "₹420 saved",
  },
  {
    id: "oil-restock",
    kind: "purchase-order",
    headline: "Oil low",
    tag: "Restock",
    title: "Cooking oil running low",
    reason: "Fortune oil down to 3 bottles and selling fast. A ₹2,000 order fits inside your cash plan.",
    cta: "Create Purchase Order",
    successMessage: "Purchase order for Fortune Oil created.",
    impact: "Avoid stockout",
  },
];

export interface RestockItem {
  id: string;
  name: string;
  need: number;
  cost: number;
  priority: "High" | "Medium" | "Low";
  velocity: string;
}

export const restockCandidates: RestockItem[] = [
  { id: "oil", name: "Cooking Oil", need: 10, cost: 2000, priority: "High", velocity: "18/week" },
  { id: "rice", name: "Rice", need: 6, cost: 1200, priority: "Medium", velocity: "9/week" },
  { id: "milk", name: "Milk", need: 10, cost: 1000, priority: "High", velocity: "40/week" },
  { id: "biscuits", name: "Biscuits", need: 20, cost: 1500, priority: "Low", velocity: "12/week" },
];

/**
 * Cash-constrained restock planner.
 * Greedy by priority then velocity; never exceeds cash minus reserve.
 */
export function planRestock(items: RestockItem[], cash: number, reserve: number) {
  const rank = { High: 0, Medium: 1, Low: 2 } as const;
  const sorted = [...items].sort((a, b) => rank[a.priority] - rank[b.priority]);
  const budget = cash - reserve;
  let spent = 0;
  const selected: RestockItem[] = [];
  const skipped: RestockItem[] = [];
  for (const item of sorted) {
    if (spent + item.cost <= budget) {
      selected.push(item);
      spent += item.cost;
    } else {
      skipped.push(item);
    }
  }
  return { selected, skipped, total: spent, remaining: cash - spent };
}

export const whatIf = {
  trigger: "10 milk packets expire tomorrow.",
  question: "Would you like to compare two ways to reduce the loss?",
  options: [
    { id: "discount", name: "10% Discount", sales: 8, revenue: 360, waste: 2, recommended: false },
    { id: "bundle", name: "Milk + Bread Bundle", sales: 10, revenue: 420, waste: 0, recommended: true },
  ],
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
