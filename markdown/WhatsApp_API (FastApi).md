# WhatsApp Business Platform API Documentation (FastAPI Version)

This documentation provides a comprehensive guide for developers to integrate and use the WhatsApp Business Platform API with FastAPI to send and receive messages, manage contacts, and interact with users programmatically.

## Table of Contents
1. [Getting Started](#1-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
2. [Authentication](#2-authentication)
3. [Sending Messages](#3-sending-messages)
    - [Text Messages](#text-messages)
    - [Media Messages](#media-messages)
    - [Interactive Messages](#interactive-messages)
    - [Template Messages](#template-messages)
4. [Receiving Messages](#4-receiving-messages)
    - [Webhook Setup](#webhook-setup)
    - [Handling Incoming Messages](#handling-incoming-messages)
5. [Managing Contacts](#5-managing-contacts)
6. [Two-Step Verification](#6-two-step-verification)
7. [Error Handling](#7-error-handling)
8. [API Reference](#8-api-reference)
9. [Examples](#9-examples)
    - [Example 1: Sending a Text Message](#example-1-sending-a-text-message)
    - [Example 2: Handling Incoming Messages](#example-2-handling-incoming-messages)
10. [Conclusion](#10-conclusion)

---

## 1. Getting Started

### Prerequisites
- A WhatsApp Business Account.
- A Phone Number ID registered with the WhatsApp Business Platform.
- An Access Token for authentication.
- Python installed (version 3.7 or later).

### Installation
Install the required Python libraries:

```bash
pip install fastapi uvicorn requests python-dotenv
```

### Configuration
Create a `.env` file in your project root with the following variables:

```plaintext
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
RECIPIENT_NUMBER=recipient_phone_number
```

## 2. Authentication
All API requests must include an Access Token in the Authorization header.

```python
import os
from dotenv import load_dotenv

load_dotenv()

headers = {
     "Authorization": f"Bearer {os.getenv('WHATSAPP_ACCESS_TOKEN')}",
     "Content-Type": "application/json"
}
```

## 3. Sending Messages

### Text Messages
Send a simple text message to a recipient.

```python
import requests

def send_text_message():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "text",
          "text": {
                "body": "Hello, this is a test message!"
          }
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(send_text_message())
```

### Media Messages
Send images, videos, or documents.

#### Example: Sending an Image

```python
def send_image_message():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "image",
          "image": {
                "link": "https://example.com/image.png",
                "caption": "Check out this image!"
          }
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(send_image_message())
```

### Interactive Messages
Send interactive messages like buttons or lists.

#### Example: Sending a Reply Button

```python
def send_interactive_message():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "interactive",
          "interactive": {
                "type": "button",
                "body": {
                     "text": "Choose an option:"
                },
                "action": {
                     "buttons": [
                          {
                                "type": "reply",
                                "reply": {
                                     "id": "option1",
                                     "title": "Option 1"
                                }
                          },
                          {
                                "type": "reply",
                                "reply": {
                                     "id": "option2",
                                     "title": "Option 2"
                                }
                          }
                     ]
                }
          }
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(send_interactive_message())
```

### Template Messages
Send pre-approved message templates.

```python
def send_template_message():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "template",
          "template": {
                "name": "hello_world",
                "language": {
                     "code": "en_US"
                }
          }
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(send_template_message())
```

## 4. Receiving Messages

### Webhook Setup
To receive incoming messages, set up a webhook endpoint using FastAPI.

#### Example: Webhook Endpoint

```python
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhook")
async def webhook(request: Request):
     payload = await request.json()
     print("Received payload:", payload)

     # Process the payload
     if payload.get("entry"):
          for entry in payload["entry"]:
                for change in entry["changes"]:
                     message = change["value"]["messages"][0]
                     print("Message received:", message)

     return {"status": "success"}

# Run the FastAPI app
if __name__ == "__main__":
     import uvicorn
     uvicorn.run(app, host="0.0.0.0", port=3000)
```

### Handling Incoming Messages
Parse the incoming payload to extract message details.

```python
def handle_incoming_message(payload):
     message = payload["entry"][0]["changes"][0]["value"]["messages"][0]
     print("Message ID:", message["id"])
     print("From:", message["from"])
     print("Text:", message["text"]["body"])
```

## 5. Managing Contacts
Send contact information to a recipient.

```python
def send_contact():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "contacts",
          "contacts": [
                {
                     "name": {
                          "formatted_name": "John Doe"
                     },
                     "phones": [
                          {
                                "phone": "1234567890",
                                "type": "WORK"
                          }
                     ]
                }
          ]
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(send_contact())
```

## 6. Two-Step Verification
Set a verification PIN.

```python
def set_verification_pin():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/account/set_pin"
     payload = {
          "pin": "123456"
     }
     response = requests.post(url, headers=headers, json=payload)
     return response.json()

# Example usage
print(set_verification_pin())
```

## 7. Error Handling
Handle errors gracefully by checking the API response.

```python
def send_message_with_error_handling():
     url = f"https://graph.facebook.com/v16.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
     payload = {
          "messaging_product": "whatsapp",
          "to": os.getenv("RECIPIENT_NUMBER"),
          "type": "text",
          "text": {
                "body": "Hello, world!"
          }
     }
     try:
          response = requests.post(url, headers=headers, json=payload)
          response.raise_for_status()
          return response.json()
     except requests.exceptions.HTTPError as error:
          return {"error": error.response.json()}

# Example usage
print(send_message_with_error_handling())
```

## 8. API Reference

### Key Endpoints
- **Send Message:** `POST /v16.0/{phone-number-id}/messages`
- **Webhook:** `POST /webhook`
- **Two-Step Verification:** `POST /v16.0/{phone-number-id}/account/set_pin`

### Objects
- **TextObject:** `{ "body": "string", "preview_url": boolean }`
- **ImageObject:** `{ "link": "string", "caption": "string" }`
- **InteractiveObject:** `{ "type": "string", "body": { "text": "string" }, "action": { "buttons": [] } }`
- **TemplateObject:** `{ "name": "string", "language": { "code": "string" } }`

## 9. Examples

### Example 1: Sending a Text Message

```python
print(send_text_message())
```

### Example 2: Handling Incoming Messages

```python
# Run the FastAPI app
if __name__ == "__main__":
     import uvicorn
     uvicorn.run(app, host="0.0.0.0", port=3000)
```

## 10. Conclusion
This documentation provides a starting point for integrating the WhatsApp Business Platform API into your FastAPI application. For more details, refer to the official WhatsApp Business Platform Documentation.