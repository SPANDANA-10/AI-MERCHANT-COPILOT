import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai

# Load configuration context profiles
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in backend/.env")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in backend/.env")

os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
ai_client = genai.Client(api_key=GEMINI_API_KEY)
GEMINI_MODEL = "gemini-3.6-flash"


def get_chat_response_with_retry(prompt, max_retries=4):
    """Retry transient Gemini service pressure issues such as 503/429/high-demand throttling."""
    last_error = None
    for attempt in range(1, max_retries + 1):
        try:
            chat = ai_client.chats.create(model=GEMINI_MODEL)
            response = chat.send_message(prompt)
            if getattr(response, "text", None):
                return response.text
            raise ValueError("Gemini returned an empty response.")
        except Exception as exc:
            last_error = exc
            message = str(exc).lower()
            if ("503" in message or "unavailable" in message or "429" in message or "high demand" in message) and attempt < max_retries:
                wait_seconds = 2 ** (attempt - 1)
                print(f"⚠️ Gemini temporarily busy; retrying in {wait_seconds}s (attempt {attempt}/{max_retries})...")
                time.sleep(wait_seconds)
                continue
            raise
    raise last_error

def ask_merchant_copilot(user_query):
    print("🔍 Fetching real-time ledger metrics for chat grounding...")
    # Fetch live state metrics straight out of your 5 tables
    products = supabase.table("products").select("*").execute().data
    credit = supabase.table("credit_records").select("*").execute().data
    
    # Calculate factual baselines so Gemini doesn't hallucinate metrics
    total_credit = sum(float(c.get("amount", 0)) for c in credit)
    out_of_stock_count = sum(1 for p in products if p.get("stock", 0) == 0)
    
    store_context = {
        "current_inventory_ledger": products,
        "outstanding_customer_credit_total": total_credit,
        "total_items_completely_out_of_stock": out_of_stock_count,
        "business_cash_on_hand": 5000.00
    }

    # Structure an immutable system directive grounding rule layout
    prompt = f"""
    You are an elite, data-grounded AI Business Assistant for a retail merchant shop.
    You have absolute access to the live store metrics text vector block below:
    {json.dumps(store_context, indent=2)}
    
    Answer the merchant's query using the real-time numbers provided above. 
    Be short, sharp, business-focused, and practical. Always quote exact calculations when applicable.
    
    Merchant Query: "{user_query}"
    Assistant Answer:
    """

    try:
        response_text = get_chat_response_with_retry(prompt)
        print(f"\n🤖 Copilot Response:\n{response_text}\n")
    except Exception as e:
        print(f"❌ Chat routing issue: {str(e)}")

if __name__ == "__main__":
    # Test your new data-grounded chatbot execution flow
    print("💬 Simulating live Merchant Chat input...")
    ask_merchant_copilot("What is the biggest issue with my cash or credit right now?")