from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
import json
from datetime import datetime
from typing import List, Dict
import requests
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI()

# Add CORS middleware to allow React app to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# WhatsApp Business API credentials
PHONE_NUMBER_ID = "594079853780037"
WA_ACCESS_TOKEN = "EAAk2WSNlS4oBO0nGy5XZBw59tQBlb4OjZCZADMZA3ZCzXVss3E3dibnZBNVcEDSKyiOsZA3CMQO3zbWswZCtyaoHNDZCroqZAYTaQwnwbGNfTAcJw4drnzMVbiSpIj12m5eK4ZBgtY9VtSb2puVd1tnTzNGHq7EZBJ3GmRZBGZB2wxAerhWKLNJdgEqB35n1cZAFBlmw1zZA39n8hhvIhth6fLuX3VC1wXUslOBEezMqGRaEdHQZBDRIOR946ftMZD"
BUSINESS_ID = "1887710258302426"
FB_BASE_URL = "https://graph.facebook.com/v19.0"

# Store conversations in memory
conversations = {}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Helper function to make Facebook API requests
def make_fb_api_request(method, endpoint, data=None):
    url = f"{FB_BASE_URL}/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    params = {'access_token': WA_ACCESS_TOKEN}

    response = requests.request(method, url, headers=headers, params=params, json=data)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()

# Pydantic models for our API endpoints
class MessageData(BaseModel):
    to: str
    text: str

class CatalogCreate(BaseModel):
    name: str
    description: str = None
    vertical: str = "commerce"

class ProductCreate(BaseModel):
    name: str
    image_url: str
    retailer_id: Optional[str] = None
    description: Optional[str] = None
    availability: Optional[str] = Field(default="in stock")
    condition: Optional[str] = Field(default="new")
    price: Optional[str] = None
    link: Optional[str] = None
    brand: Optional[str] = None
    google_product_category: Optional[str] = None


@app.get("/",)
async def home():
    return {"message": "We are live!"}
# API endpoints for catalog management
@app.post("/api/catalogs")
async def create_catalog(catalog: CatalogCreate):
    try:
        endpoint = f"{BUSINESS_ID}/owned_product_catalogs"
        data = {
            "name": catalog.name,
            "vertical": catalog.vertical
        }
        
        if catalog.description:
            data["description"] = catalog.description
            
        response = make_fb_api_request('POST', endpoint, data)
        
        return {
            "status": "Catalog created", 
            "catalog_id": response.get("id"),
            "details": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/catalogs")
async def list_catalogs():
    try:
        endpoint = f"{BUSINESS_ID}/owned_product_catalogs"
        response = make_fb_api_request('GET', endpoint)
        
        return {"catalogs": response.get("data", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/catalogs/{catalog_id}")
async def update_catalog(catalog_id: str, catalog: CatalogCreate):
    try:
        endpoint = f"{catalog_id}"
        data = {"name": catalog.name}
        
        if catalog.description:
            data["description"] = catalog.description
            
        response = make_fb_api_request('POST', endpoint, data)
        
        return {"status": "Catalog updated", "details": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/catalogs/{catalog_id}/delete")
async def delete_catalog(catalog_id: str):
    try:
        endpoint = f"{catalog_id}"
        response = make_fb_api_request('DELETE', endpoint)
        
        return {"status": "Catalog deleted", "details": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/catalogs/{catalog_id}/products")
async def add_product(catalog_id: str, product: ProductCreate):
    try:
        endpoint = f"{catalog_id}/products"
        
        # Generate retailer_id if not provided
        retailer_id = product.retailer_id or f"product_{uuid.uuid4().hex[:8]}"
        
        # Prepare the product data with defaults
        product_data = {
            "retailer_id": retailer_id,
            "name": product.name,
            "description": product.description or product.name,
            "availability": product.availability or "in stock",
            "condition": product.condition or "new",
            "link": product.link or "https://example.com/product",
            "image_url": product.image_url,
            "brand": product.brand or "Generic",
            "google_product_category": product.google_product_category or "5181"
        }
        
        # Handle price if provided
        if product.price:
            try:
                price_value, currency = product.price.split()
                product_data["price"] = f"{int(float(price_value))}"
                product_data["currency"] = currency
            except ValueError:
                product_data["price"] = "0"
                product_data["currency"] = "USD"
        else:
            product_data["price"] = "0"
            product_data["currency"] = "USD"
        
        response = make_fb_api_request('POST', endpoint, product_data)
        
        return {"status": "Product added", "product_id": response.get("id"), "details": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/catalogs/{catalog_id}/products")
async def list_products(catalog_id: str):
    try:
        endpoint = f"{catalog_id}/products"
        response = make_fb_api_request('GET', endpoint)
        
        return {"products": response.get("data", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WhatsApp messaging endpoints
@app.post("/webhook")
async def receive_whatsapp_message(request: Request):
    data = await request.json()
    print(f"📩 Incoming Message: {data}")

    # Extract the message details
    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                if "value" in change and "messages" in change["value"]:
                    for message in change["value"]["messages"]:
                        sender_number = message["from"]
                        message_text = message["text"]["body"]
                        print(f"Received '{message_text}' from {sender_number}")

                        # Current timestamp for the message
                        timestamp = datetime.now().strftime("%I:%M %p")
                        
                        # Store the message in conversations
                        if sender_number not in conversations:
                            conversations[sender_number] = []
                        conversations[sender_number].append({
                            "type": "customer",
                            "text": message_text,
                            "time": timestamp
                        })
                        
                        # Send update via WebSocket
                        await manager.broadcast(json.dumps({
                            "type": "new_message",
                            "sender": sender_number,
                            "conversations": conversations
                        }))

    return {"status": "Message processed"}

@app.post("/api/send-message")
async def send_message(message: MessageData):
    url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {WA_ACCESS_TOKEN}"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": message.to,
        "type": "text",
        "text": {"body": message.text}
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        print(f"📤 Reply Sent: {response_data}")

        # Current timestamp for the message
        timestamp = datetime.now().strftime("%I:%M %p")
        
        # Store the sent message in conversations
        if message.to not in conversations:
            conversations[message.to] = []
        conversations[message.to].append({
            "type": "agent",
            "text": message.text,
            "time": timestamp
        })
        
        # Send update via WebSocket
        await manager.broadcast(json.dumps({
            "type": "new_message",
            "sender": message.to,
            "conversations": conversations
        }))

        return {"status": "Message sent", "response": response_data}
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-conversations")
async def get_conversations():
    return {"conversations": conversations}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial data when connected
        await websocket.send_text(json.dumps({
            "type": "initial_data", 
            "conversations": conversations
        }))
        
        # Keep the connection alive and handle any messages from client
        while True:
            data = await websocket.receive_text()
            # Process any client messages if needed
            print(f"Received message from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)