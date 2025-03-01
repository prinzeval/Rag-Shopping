from dotenv import load_dotenv

import os
import requests

# Load environment variables from a .env file
load_dotenv()

# Get credentials from the environment
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
RECIPIENT_NUMBER = os.getenv("RECIPIENT_NUMBER")  # Replace with your target phone number

# Define the URL and headers
url = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json"
}

# Define the payload
data = {
    "messaging_product": "whatsapp",
    "to": RECIPIENT_NUMBER,
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "en_US"
        }
    }
}

# Send the POST request
try:
    response = requests.post(url, json=data, headers=headers)
    if response.ok:
        print("Message sent successfully:", response.json())
    else:
        print("Error sending message:", response.status_code, response.text)
except requests.exceptions.RequestException as e:
    print("Request failed:", str(e))
