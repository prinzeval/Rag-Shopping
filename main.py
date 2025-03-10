from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import json
from datetime import datetime
from typing import List, Dict
import requests
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Supabase connection setup
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

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


# Your WhatsApp Business API credentials
ACCESS_TOKEN = "EAAk2WSNlS4oBO4FlYNy9zZCn64Ft3hdge0ApiLRG3NZCXMYULOAWrqO6FL6P9WUbMYkuKGb8rs7sCUzZCXUtZCmT0emeqBpViHHV0IZBs6ZCUZBbZCjyJE3mA20nzBQGay3f5RRPJtSrOliAK778aoGvF9z4ZCAuc76ZA5NWC6XhpWye5dnQ55AkgqRalLA5Jfoz4WsiZBQNWW33MQnTkgNZC8yPtkqZCtA0V1BeGUBc4OQmmJdgMPAnm39gZD"
PHONE_NUMBER_ID = "594079853780037"

# Store conversations in memory (optional, now using DB)
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

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Pydantic models
class MessageData(BaseModel):
    to: str
    text: str


class CatalogCreate(BaseModel):
    name: str
    description: str
    business_id: str
    access_token: str  # Add this field

class ProductCreate(BaseModel):
    catalog_id: int
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

# API endpoints
@app.post("/api/catalogs")
async def create_catalog(catalog: CatalogCreate):
    try:
        response = supabase.table("catalogs").insert(catalog.dict()).execute()
        return {"status": "Catalog created", "catalog": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/products")
async def add_product(product: ProductCreate):
    try:
        response = supabase.table("products").insert(product.dict()).execute()
        return {"status": "Product added", "product": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/catalogs")
async def list_catalogs():
    try:
        response = supabase.table("catalogs").select("*").execute()
        return {"catalogs": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/catalogs/{catalog_id}")
async def delete_catalog(catalog_id: int):
    try:
        response = supabase.table("catalogs").delete().eq("id", catalog_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Catalog not found")
        return {"status": "Catalog deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Existing endpoints (WhatsApp, WebSocket, etc.)
@app.get("/")
async def get_chat_ui():
    with open("static/index.html", "r") as file:
        return HTMLResponse(content=file.read())

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
        "Authorization": f"Bearer {ACCESS_TOKEN}"
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