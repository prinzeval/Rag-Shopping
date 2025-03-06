from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import requests
import os

app = FastAPI()

# Your WhatsApp Business API credentials
ACCESS_TOKEN = "EAAk2WSNlS4oBO3REZCGG9ykQkxgtKzWvHrRWNDQ47VgQyVH3QTOJbf2XO8KiLFYG3a793VJZAfshh3UuetJ5vr6IHi0XroYKglDIMA3kkHfUR11al0DZARLfR008uTxu56UmZCdqJu5URDoy4PXtNSCmnrRDjbB6V7ze9nUMKgvpckL9S259oPUt2piXM0BuM4TUOes8pJqLaC8ouZCZATvI83OwHiZBFFIxZACupaavpxj79LwMLyzt"
PHONE_NUMBER_ID = "594079853780037"

# Store conversations in memory
conversations = {}

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

class MessageData(BaseModel):
    to: str
    text: str

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

                        # Store the message in conversations
                        if sender_number not in conversations:
                            conversations[sender_number] = []
                        conversations[sender_number].append({
                            "type": "customer",
                            "text": message_text,
                            "time": "10:00 AM"  # Replace with actual timestamp
                        })

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

        # Store the sent message in conversations
        if message.to not in conversations:
            conversations[message.to] = []
        conversations[message.to].append({
            "type": "agent",
            "text": message.text,
            "time": "10:00 AM"  # Replace with actual timestamp
        })

        return {"status": "Message sent", "response": response_data}
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-conversations")
async def get_conversations():
    return {"conversations": conversations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)