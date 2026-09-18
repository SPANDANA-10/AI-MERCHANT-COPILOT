import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Force load the environment keys from your local .env configuration file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Establish cloud database link
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_database():
    print("🌱 [1/3] Injecting mock merchant profile data...")
    try:
        supabase.table("merchants").insert({
            "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", 
            "name": "Rajesh Kumar", 
            "shop_name": "Kirana Supermarket", 
            "phone": "+91 98765 43210"
        }).execute()
    except Exception as e:
        print(f"ℹ️ Merchant might already exist: {str(e)}")

    print("📦 [2/3] Injecting detailed stock and inventory profiles...")
    try:
        supabase.table("products").insert([
            {"merchant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "name": "Amul Gold Milk 1L", "category": "Dairy", "stock": 3, "price": 66.00, "daily_sales": 15},
            {"merchant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "name": "Fortune Sunflower Oil 1L", "category": "Groceries", "stock": 42, "price": 135.00, "daily_sales": 12},
            {"merchant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "name": "Britannia Marie Gold 250g", "category": "Snacks", "stock": 0, "price": 30.00, "daily_sales": 28}
        ]).execute()
    except Exception as e:
        print(f"❌ Error inserting products: {str(e)}")

    print("💸 [3/3] Injecting customer outstanding credit ledger logs...")
    try:
        supabase.table("credit_records").insert([
            {"merchant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "customer_name": "Amit Sharma", "amount": 3500.00, "due_date": "2026-09-10"},
            {"merchant_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "customer_name": "Vikas Patel", "amount": 1200.00, "due_date": "2026-09-25"}
        ]).execute()
    except Exception as e:
        print(f"❌ Error inserting credit records: {str(e)}")

    print("✅ Complete! All baseline hackathon mock metrics have loaded successfully!")

if __name__ == "__main__":
    seed_database()