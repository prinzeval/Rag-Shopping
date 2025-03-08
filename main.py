from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
import json
from datetime import datetime
from typing import List, Dict

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
ACCESS_TOKEN = "EAAk2WSNlS4oBO0FcPvA1om4bNDtM8dI9ZCmnTG4vqr2yOuRZCPzVJdfjric7fJdzdM62Yx5S9VtRxg5cc9ANq1qVPTll8Fadx0w1DtPZCTbZAIdk4DGb2c6tZCt8iXW8FFN245f5XaD2i4ZANK06wr1omXHcgzhgCZBZAEmx9eQkYc9gFcTgNiHOZAmTcZANn54rkWJwji2ssOosOJlV3en7ZBh2jG1Kc0nePESyKOpP0efraBZB1nxx1B0D"
PHONE_NUMBER_ID = "594079853780037"

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

# Pydantic model for message data
class MessageData(BaseModel):
    to: str
    text: str

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