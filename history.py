from fastapi import FastAPI, Request, HTTPException
import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()

# Get credentials from the environment
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")

def send_whatsapp_message(recipient_number: str, message: str):
    """
    Function to send a WhatsApp message using the Facebook Graph API
    """
    url = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    data = {
        "messaging_product": "whatsapp",
        "to": recipient_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    try:
        print(f"Sending message to {recipient_number}: {message}")
        response = requests.post(url, json=data, headers=headers)
        if response.ok:
            print("Message sent successfully:", response.json())
        else:
            print("Error sending message:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Request failed:", str(e))

@app.post("/webhook")
async def webhook(request: Request):
    """
    Endpoint to handle incoming WhatsApp messages
    """
    try:
        # Parse the incoming JSON payload
        payload = await request.json()
        print(f"Received payload: {payload}")

        # Process the payload
        if "entry" in payload:
            for entry in payload["entry"]:
                changes = entry.get("changes", [])
                for change in changes:
                    value = change.get("value", {})
                    
                    # Extract metadata
                    metadata = value.get("metadata", {})
                    display_phone_number = metadata.get("display_phone_number")
                    business_phone_number_id = metadata.get("phone_number_id")
                    print(f"Business Phone: {display_phone_number}, ID: {business_phone_number_id}")

                    # Extract contact details
                    contacts = value.get("contacts", [])
                    for contact in contacts:
                        user_name = contact.get("profile", {}).get("name")
                        wa_id = contact.get("wa_id")
                        print(f"Contact Name: {user_name}, WA ID: {wa_id}")

                    # Extract message details
                    messages = value.get("messages", [])
                    for message in messages:
                        message_id = message.get("id")
                        sender = message.get("from")
                        timestamp = message.get("timestamp")
                        message_type = message.get("type")
                        message_body = message.get("text", {}).get("body", "No text provided")

                        print(
                            f"Message ID: {message_id}, From: {sender}, "
                            f"Timestamp: {timestamp}, Type: {message_type}, Body: {message_body}"
                        )

                        # Check if the message is "hi" and send a response
                        if message_body:
                            print(f"Sending response to {sender}")
                            send_whatsapp_message(sender,message_body)

        return {"status": "success", "message": "Webhook processed successfully"}
    
    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=400, detail="Failed to process webhook")

# Run the app (if running directly)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)