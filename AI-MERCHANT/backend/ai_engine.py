import os
import json
import time
from datetime import datetime, date
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai

# 1. Initialize environments and dependencies
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Pass the key explicitly into the modern SDK configuration mapping
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
ai_client = genai.Client(api_key=GEMINI_API_KEY)

GEMINI_MODEL = "gemini-3.6-flash"


def get_model_text_with_retry(prompt, max_retries=4):
    """Retry transient service errors from Gemini; 503/429/high-demand responses are temporary."""
    last_error = None

    for attempt in range(1, max_retries + 1):
        try:
            chat = ai_client.chats.create(model=GEMINI_MODEL)
            response = chat.send_message(prompt)

            text = getattr(response, "text", "")
            if not text and hasattr(response, "candidates"):
                parts = []
                for candidate in response.candidates:
                    content = getattr(candidate, "content", None)
                    if content is None:
                        continue
                    if hasattr(content, "parts"):
                        for part in content.parts:
                            if hasattr(part, "text"):
                                parts.append(part.text)
                    elif isinstance(content, list):
                        for part in content:
                            if hasattr(part, "text"):
                                parts.append(part.text)
                text = "".join(parts)

            if text:
                return text
            raise ValueError("Gemini returned an empty response.")

        except Exception as exc:
            last_error = exc
            message = str(exc).lower()
            if ("503" in message or "unavailable" in message or "429" in message or "high demand" in message) and attempt < max_retries:
                wait_seconds = 2 ** (attempt - 1)
                print(f"⚠️ Gemini temporarily busy (attempt {attempt}/{max_retries}). Retrying in {wait_seconds}s...")
                time.sleep(wait_seconds)
                continue
            raise

    raise last_error

# ==========================================================
# ADVANCED MATHEMATICAL BUSINESS INTELLIGENCE ENGINE
# ==========================================================
def calculate_advanced_store_analytics(products, credit_records):
    """Calculates all deterministic values and problem vectors for the UI."""
    
    # Feature 1: Financial Clarity Computations
    total_inventory_value = sum(float(p.get("stock", 0)) * float(p.get("price", 0)) for p in products)
    total_customer_credit = sum(float(c.get("amount", 0)) for c in credit_records)
    
    # Hackathon hardcoded demo variables for available working cash structures
    available_cash = 5000.00 
    
    financial_clarity = {
        "available_cash": available_cash,
        "total_customer_credit": total_customer_credit,
        "total_inventory_value": total_inventory_value,
        "capital_locked_summary": f"📊 Financial Health: ₹{total_inventory_value:,.2f} is locked in inventory stock. ₹{total_customer_credit:,.2f} is outstanding in customer credits."
    }
    
    # Feature 2: Growth Blocker Logic Formulation
    biggest_blocker = {}
    if total_customer_credit > available_cash:
        biggest_blocker = {
            "problem": f"₹{total_customer_credit:,.2f} is heavily locked down in credit records.",
            "impact": "High collection risk slowing down your purchasing power for fresh stock rows."
        }
    else:
        biggest_blocker = {
            "problem": "Low liquid working capital runway on hand.",
            "impact": "Restricts bulk purchasing options for fast-moving goods categories."
        }

    # Feature 3 & 4: What-If & Cash-Constrained Restock Flag Detectors
    critical_alerts = []
    for prod in products:
        stock = prod.get("stock", 0)
        daily_sales = prod.get("daily_sales", 0)
        price = float(prod.get("price", 0))
        
        # Capture critical low-stock items or immediate expiry warning conditions
        if stock == 0 or stock < daily_sales:
            # Predict estimated stockout impact window numbers
            lost_revenue_potential = daily_sales * price * 3  # Calculated 3-day projection loss
            critical_alerts.append({
                "type": "stockout_risk",
                "product_name": prod.get("name"),
                "current_stock": stock,
                "daily_velocity": daily_sales,
                "unit_price": price,
                "projected_3day_loss": lost_revenue_potential,
                "merchant_id": prod.get("merchant_id")
            })
            
    return financial_clarity, biggest_blocker, critical_alerts

def run_copilot_pipeline():
    print("🔄 [1/4] Extracting live data profiles out of Supabase cloud tables...")
    products = supabase.table("products").select("*").execute().data
    credit_records = supabase.table("credit_records").select("*").execute().data
    
    if not products:
        print("⚠️ Your database is currently empty! Please make sure to populate seed rows first.")
        return

    print("📊 [2/4] Executing complex mathematical formulas for advanced feature layers...")
    financials, blockers, alerts = calculate_advanced_store_analytics(products, credit_records)

    # Compile the final structured dataset bundle to hand over to the prompt
    master_ai_context = {
        "financial_clarity_metrics": financials,
        "detected_growth_blocker": blockers,
        "critical_operational_alerts": alerts
    }

    print("🤖 [3/4] Dispatching calculated data metrics matrix to Gemini platform...")
    
    prompt = f"""
    You are the central engine core for an AI Merchant Growth Copilot system.
    Analyze this pre-calculated store health context dataset:
    {json.dumps(master_ai_context, indent=2)}
    
    You must construct high-value, actionable recommendations that populate the matching frontend interface features perfectly:
    1. For 'Growth Blocker AI': Translate the problem statement into a prioritized step-by-step action plan.
    2. For 'Proactive What-If Simulator': Target a critical alert item. Create two clear paths: Action A vs Action B, and project their financial outcomes.
    3. For 'Cash-Constrained Restock': Recommend a smart purchase allocation for low stock items using a maximum budget of ₹5,000, leaving an explicit safe reserve.
    4. For 'Action Copilot': Assign an executable automation system handle to the strategy.
    
    CRITICAL STRUCTURE REQUIREMENT: Return your output response strictly as a raw JSON array of objects. Do not include markdown code ticks like ```json or trailing sentences.
    Each object in your output array must strictly match these layout schema keys:
    - merchant_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
    - type: (Must be exactly one of: "financial_clarity", "growth_blocker", "what_if_simulator", "cash_restock")
    - opportunity: (A clear, concise, punchy title summarizing the business advantage)
    - recommendation: (The core actionable instruction text for the store owner)
    - reason: (Detailed explanation containing specific financial projections or velocity numbers)
    - action_trigger: (Must be exactly one of: "SEND_WHATSAPP_REMINDER", "CREATE_FLASH_SALE", "GENERATE_PURCHASE_ORDER", "NONE")
    - status: "pending"
    """

    try:
        raw_response_text = get_model_text_with_retry(prompt)

        # Safely clean out string wraps
        clean_json_text = raw_response_text.strip().lstrip("```json").rstrip("```").strip()
        recommendations = json.loads(clean_json_text)
        
        print(f"📝 [4/4] Writing {len(recommendations)} rich feature items directly into the Supabase database...")
        
        # Clean out old recommendations first to prevent cluttering the demo dashboard view
        supabase.table("ai_recommendations").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        
        for rec in recommendations:
            # Combine opportunity and recommendation text clearly to match your UI schema rules
            combined_recommendation = f"[{rec.get('opportunity')}] {rec.get('recommendation')}"
            
            supabase.table("ai_recommendations").insert({
                "merchant_id": rec.get("merchant_id"),
                "type": rec.get("type"),
                "recommendation": combined_recommendation,
                "reason": f"{rec.get('reason')} | Trigger Action: {rec.get('action_trigger')}",
                "status": rec.get("status")
            }).execute()
            
        print("✅ Success! Your pipeline successfully populated all advanced copilot features into your database.")
        
    except Exception as e:
        print(f"❌ Core engine failure during generation pass: {str(e)}")

if __name__ == "__main__":
    run_copilot_pipeline()