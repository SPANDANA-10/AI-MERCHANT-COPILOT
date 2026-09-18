# Kirana Growth AI

Build a polished hackathon-quality web app called AI Merchant Growth Copilot for Indian kirana and small retail merchants.

The product is NOT a generic analytics dashboard. Its core purpose is:

Merchant Data → AI detects problem/opportunity → explains why → recommends action → merchant executes → AI considers available cash before recommending actions.

Create a modern, professional SaaS-style responsive web application with these main navigation items:

1. Dashboard

2. Financial Clarity

3. Growth Blocker AI

4. Proactive What-If

5. Action Copilot

6. Cash-Constrained Restock

Use realistic Indian merchant sample data and ₹ currency.

DASHBOARD

Create a strong overview screen.

Show:

- Available Cash: ₹5,000

- Inventory Value: ₹12,000

- Customer Credit: ₹3,000

- Pending Payments: ₹2,000

- Today's Sales: ₹2,450

Create a prominent AI Growth Insight card:

“Your sales are growing 18%, but ₹3,000 is stuck in customer credit. This is limiting your ability to restock your fastest-selling products.”

Add button:

“See Recommended Actions”

Also show:

- Sales trend

- Cash position

- Top selling products

- AI recommended actions

FINANCIAL CLARITY

Create a page called “Financial Clarity Layer”.

The purpose is to answer:

“Where is my actual money?”

Show:

- Available Cash: ₹5,000

- Customer Credit: ₹3,000

- Inventory: ₹4,000

- Pending Payments: ₹2,000

Use a clean visual money-flow representation.

Show an AI explanation:

“Your revenue is healthy, but part of your working capital is locked in customer credit and inventory.”

Do not make this page overloaded with charts.

GROWTH BLOCKER AI

Create a prominent AI diagnosis screen.

Title:

“Your Biggest Growth Blocker”

Current blocker:

“Cash locked in customer credit”

Show:

- ₹3,000 customer credit

- ₹800 overdue

- Fast-moving inventory requiring restock

Explain why this is blocking growth.

Create an AI Action Plan:

1. Collect ₹800 overdue payment

   Button: “Send WhatsApp Reminder”

2. Prioritize fast-moving inventory

   Button: “View Smart Restock”

3. Preserve ₹800 cash reserve

   Button: “Apply Plan”

Clicking actions should show realistic success states/toasts.

PROACTIVE WHAT-IF

This feature must be proactive.

Do NOT make the merchant manually enter hypothetical percentages.

Show an AI opportunity:

“10 milk packets expire tomorrow.”

AI asks:

“Would you like to compare two ways to reduce the loss?”

Option A:

10% Discount

Option B:

Milk + Bread Bundle

Show comparison:

Expected Sales

Expected Revenue

Expected Waste

Use sample values:

10% Discount:

Expected Sales: 8

Expected Revenue: ₹360

Expected Waste: 2

Milk + Bread Bundle:

Expected Sales: 10

Expected Revenue: ₹420

Expected Waste: 0

Add:

“Apply Bundle”

After clicking, show:

“Bundle campaign created successfully.”

ACTION COPILOT

Create an Action Center.

Show:

“3 AI actions recommended today”

Action 1:

₹800 overdue customer payment

Button: “Send WhatsApp Reminder”

Action 2:

10 milk packets expiring tomorrow

Button: “Create Bundle Offer”

Action 3:

Cooking oil running low

Button: “Create Purchase Order”

Each button should produce a realistic success state.

CASH-CONSTRAINED RESTOCK

This is a key differentiating feature.

Show:

Available Cash: ₹5,000

Products:

Cooking Oil — Need 10 — Cost ₹2,000 — High Priority

Rice — Need 6 — Cost ₹1,200 — Medium Priority

Milk — Need 10 — Cost ₹1,000 — High Priority

Biscuits — Need 20 — Cost ₹1,500 — Low Priority

AI must NOT recommend purchasing more than available cash.

Show:

“Recommended Purchase: ₹4,200”

Cooking Oil: ₹2,000

Rice: ₹1,200

Milk: ₹1,000

Cash Remaining: ₹800

AI explanation:

“Based on available liquidity, sales velocity and product priority, this purchase plan covers urgent fast-moving products while preserving ₹800 cash.”

Button:

“Generate Purchase Order”

After clicking:

“Purchase order generated.”

DESIGN

Make the UI look like a serious fintech/business product suitable for an AI hackathon.

Use:

- Clean modern layout

- Professional typography

- Cards with clear hierarchy

- Subtle animations

- Responsive design

- Clear AI indicators

- Strong CTA buttons

- Good empty/loading/success states

- No excessive gradients

- No unnecessary decorative elements

Important:

The product should feel like an AI decision and action system, not a dashboard full of charts.

Use mock data for now. Build the frontend and interactions first. Keep the architecture clean so a backend/database can be connected later.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kirana-ai-copilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f134139c-370a-4f19-bf7b-8c0b35bfdc5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
