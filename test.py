
from fastapi import FastAPI, Request
import requests
import json

app = FastAPI()

# Your credentials
ACCESS_TOKEN = "EAAk2WSNlS4oBO3REZCGG9ykQkxgtKzWvHrRWNDQ47VgQyVH3QTOJbf2XO8KiLFYG3a793VJZAfshh3UuetJ5vr6IHi0XroYKglDIMA3kkHfUR11al0DZARLfR008uTxu56UmZCdqJu5URDoy4PXtNSCmnrRDjbB6V7ze9nUMKgvpckL9S259oPUt2piXM0BuM4TUOes8pJqLaC8ouZCZATvI83OwHiZBFFIxZACupaavpxj79LwMLyzt"  # Replace with your actual access token
PHONE_NUMBER_ID = "594079853780037"  # Replace with your WhatsApp phone number ID

@app.post("/webhook")
async def receive_whatsapp_message(request: Request):
    data = await request.json()
    print(f"📩 Incoming Message: {data}")  # Log incoming message

    # Extract the message details
    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                if "value" in change and "messages" in change["value"]:
                    for message in change["value"]["messages"]:
                        sender_number = message["from"]  # Sender's WhatsApp number
                        message_text = message["text"]["body"]  # Message content

                        print(f"Received '{message_text}' from {sender_number}")

                        # Send an auto-reply
                        send_whatsapp_message(sender_number, "Hi! 👋")

    return {"status": "Message processed"}

# Function to send a WhatsApp reply
def send_whatsapp_message(to, text):
    url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }

    response = requests.post(url, headers=headers, json=payload)
    print(f"📤 Reply Sent: {response.json()}")

