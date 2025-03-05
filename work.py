import requests
import json

# Set up credentials
access_token = "EAAk2WSNlS4oBOy8dmblk3MZBPT1TvxuJyZAaRgaHNb6VXyVb6OQoRXZBF9sra2KGRC6GhjWYeFdohUZCoLnzmQvZA6AqbSAAHC0PFZAxg4rCznVbr8W9795jcMh3WeE1ZBW0P27JhkAZBK3n2NpU3wJ7hXXlHKyNVQXdn2NjgewIp1ZAvzeZCf4Jz88ZAaY5cTWX8WpVQtVaMMobjZAJpZBOypunbgfO8lg3VO8BZBStAZD"  # Replace with your valid access token
phone_number_id = "594079853780037"  # Replace with your retrieved Phone Number ID
recipient_number = "+2348148246314"  # Replace with the number you want to send the message to (e.g., +1234567890)

# API Endpoint
url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"

# Message Data
payload = {
    "messaging_product": "whatsapp",
    "to": recipient_number,
    "type": "text",
    "text": {
        "body": "Hello! This is a test message from my WhatsApp bot 🚀."
    }
}

# Send the request
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}

response = requests.post(url, headers=headers, json=payload)

# Print response
print(response.status_code, response.json())
