from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import requests
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env file
load_dotenv()

# Supabase client setup with error handling
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    logger.error("Supabase credentials missing. Make sure SUPABASE_URL and SUPABASE_KEY are set in .env file")

try:
    supabase = create_client(url, key)
    logger.info(f"Supabase client initialized with URL: {url[:20]}...")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    supabase = None

# Dependency to ensure Supabase is connected
def get_supabase():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection is not available")
    return supabase


# ---------- MODELS ----------

class BusinessCreate(BaseModel):
    name: str
    business_id: str
    access_token: str
    phone_number_id: str


class CatalogCreate(BaseModel):
    name: str
    description: str
    business_id: int  # Reference to businesses table


class ProductCreate(BaseModel):
    catalog_id: int  # Reference to catalogs table
    retailer_id: str
    name: str
    description: str
    price: float
    currency: str = "USD"
    availability: str = "in stock"
    condition: str = "new"
    image_url: str
    brand: str
    google_product_category: str


class SimpleMessageData(BaseModel):
    to: str
    text: str


# ---------- TESTING ENDPOINTS ----------

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.get("/api/test-db")
async def test_db():
    try:
        if not url or not key:
            return {
                "status": "Configuration error", 
                "detail": "Supabase credentials not configured",
                "supabase_url_set": bool(url),
                "supabase_key_set": bool(key)
            }
            
        response = supabase.table("businesses").select("count", count="exact").execute()
        return {"status": "Connected", "count": response.count}
    except Exception as e:
        logger.error(f"Database test failed: {str(e)}")
        return {"status": "Failed", "error": str(e)}


# ---------- BUSINESS MANAGEMENT ----------

# Create a Business
@app.post("/api/businesses")
async def create_business(business: BusinessCreate, db = Depends(get_supabase)):
    try:
        logger.info(f"Creating business: {business.name}")
        response = db.table("businesses").insert(business.model_dump()).execute()
        logger.info(f"Business created successfully: {business.name}")
        return {"status": "Business created", "business": response.data[0]}
    except Exception as e:
        logger.error(f"Error creating business: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get all Businesses
@app.get("/api/businesses")
async def get_businesses(db = Depends(get_supabase)):
    try:
        response = db.table("businesses").select("*").execute()
        return {"businesses": response.data}
    except Exception as e:
        logger.error(f"Error fetching businesses: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get a specific Business
@app.get("/api/businesses/{business_id}")
async def get_business(business_id: str, db = Depends(get_supabase)):
    try:
        response = db.table("businesses").select("*").eq("business_id", business_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Business not found")
        return {"business": response.data}
    except Exception as e:
        logger.error(f"Error fetching business: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------- CATALOG MANAGEMENT ----------

# Create a Catalog
@app.post("/api/catalogs")
async def create_catalog(catalog: CatalogCreate, db = Depends(get_supabase)):
    try:
        logger.info(f"Creating catalog: {catalog.name}")
        response = db.table("catalogs").insert(catalog.model_dump()).execute()
        return {"status": "Catalog created", "catalog": response.data[0]}
    except Exception as e:
        logger.error(f"Error creating catalog: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get all Catalogs
@app.get("/api/catalogs")
async def get_catalogs(db = Depends(get_supabase)):
    try:
        response = db.table("catalogs").select("*").execute()
        return {"catalogs": response.data}
    except Exception as e:
        logger.error(f"Error fetching catalogs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get Catalogs for a Business
@app.get("/api/businesses/{business_id}/catalogs")
async def get_business_catalogs(business_id: int, db = Depends(get_supabase)):
    try:
        response = db.table("catalogs").select("*").eq("business_id", business_id).execute()
        return {"catalogs": response.data}
    except Exception as e:
        logger.error(f"Error fetching catalogs for business: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------- PRODUCT MANAGEMENT ----------

# Create a Product
@app.post("/api/products")
async def create_product(product: ProductCreate, db = Depends(get_supabase)):
    try:
        logger.info(f"Creating product: {product.name}")
        response = db.table("products").insert(product.model_dump()).execute()
        return {"status": "Product created", "product": response.data[0]}
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get all Products
@app.get("/api/products")
async def get_products(db = Depends(get_supabase)):
    try:
        response = db.table("products").select("*").execute()
        return {"products": response.data}
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get Products for a Catalog
@app.get("/api/catalogs/{catalog_id}/products")
async def get_catalog_products(catalog_id: int, db = Depends(get_supabase)):
    try:
        response = db.table("products").select("*").eq("catalog_id", catalog_id).execute()
        return {"products": response.data}
    except Exception as e:
        logger.error(f"Error fetching products for catalog: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------- MESSAGING ----------

# Get first available business or default business
async def get_default_business(db):
    try:
        # First try to get the first business
        response = db.table("businesses").select("*").limit(1).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="No businesses found. Please create a business first.")
    except Exception as e:
        logger.error(f"Error fetching default business: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Send WhatsApp Message with automatic business selection
@app.post("/api/send-message")
async def send_message(message: SimpleMessageData, business_id: str = None, db = Depends(get_supabase)):
    # Get business credentials - either from parameter or default
    try:
        if business_id:
            logger.info(f"Fetching credentials for specified business: {business_id}")
            business_response = (
                db.table("businesses")
                .select("access_token, phone_number_id, name, business_id")
                .eq("business_id", business_id)
                .single()
                .execute()
            )
            business = business_response.data
            
            if not business:
                logger.warning(f"Specified business not found: {business_id}")
                raise HTTPException(status_code=404, detail=f"Business with ID {business_id} not found")
        else:
            # Get default business
            logger.info("No business specified, using default business")
            business = await get_default_business(db)
            logger.info(f"Using default business: {business['name']}")
        
        access_token = business["access_token"]
        phone_number_id = business["phone_number_id"]
        
    except Exception as e:
        logger.error(f"Error fetching business credentials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch business credentials")

    # WhatsApp API URL and Headers
    url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": message.to,
        "type": "text",
        "text": {"body": message.text},
    }

    # Send Message
    try:
        logger.info(f"Sending WhatsApp message to: {message.to} using business: {business['name']}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise exception for non-200 responses
        response_data = response.json()
        logger.info(f"Message sent successfully: {response_data}")
        return {
            "status": "Message sent", 
            "response": response_data,
            "business": {
                "name": business["name"],
                "business_id": business["business_id"]
            }
        }
    except requests.RequestException as e:
        logger.error(f"Error sending WhatsApp message: {str(e)}")
        if hasattr(e, 'response') and e.response:
            try:
                error_detail = e.response.json()
                logger.error(f"WhatsApp API error: {error_detail}")
                return {"status": "Failed", "error": error_detail, "status_code": e.response.status_code}
            except:
                return {"status": "Failed", "error": str(e), "status_code": e.response.status_code if hasattr(e, 'response') else 500}
        raise HTTPException(status_code=500, detail=str(e))


# List Available Messages Templates
@app.get("/api/message-templates")
async def get_message_templates(business_id: str = Query(None), db = Depends(get_supabase)):
    try:
        # Get business credentials
        if business_id:
            business_response = (
                db.table("businesses")
                .select("access_token, phone_number_id, name")
                .eq("business_id", business_id)
                .single()
                .execute()
            )
            business = business_response.data
            
            if not business:
                raise HTTPException(status_code=404, detail=f"Business with ID {business_id} not found")
        else:
            # Get default business
            business = await get_default_business(db)
        
        access_token = business["access_token"]
        phone_number_id = business["phone_number_id"]
        
        # Fetch templates from WhatsApp API
        url = f"https://graph.facebook.com/v19.0/{phone_number_id}/message_templates"
        headers = {
            "Authorization": f"Bearer {access_token}",
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        templates = response.json()
        
        return {
            "business_name": business["name"],
            "templates": templates
        }
        
    except requests.RequestException as e:
        logger.error(f"Error fetching message templates: {str(e)}")
        if hasattr(e, 'response') and e.response:
            try:
                error_detail = e.response.json()
                return {"status": "Failed", "error": error_detail}
            except:
                return {"status": "Failed", "error": str(e)}
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Error in get_message_templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)