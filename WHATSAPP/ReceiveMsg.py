from fastapi import FastAPI, Request, HTTPException
import requests
import os
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# WhatsApp API credentials
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")

# Database connection details
DB_URI = "mysql+mysqlconnector://root:Vondabaic2020@localhost:3306/chinook"
db = SQLDatabase.from_uri(DB_URI)

# Initialize FastAPI app
app = FastAPI()

# Helper function to send a WhatsApp message
def send_whatsapp_message(recipient, message):
    url = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    data = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "text",
        "text": {"body": message},
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        print("Message sent successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error sending message:", e)

# Define the RAG chain
def create_rag_chain():
    def get_schema(_):
        return db.get_table_info()

    # SQL query prompt template
    sql_template = """Based on the table schema below, write a SQL query that would answer the user's question:
    {schema}
    Question: {question}
    SQL Query:"""

    sql_prompt = ChatPromptTemplate.from_template(sql_template)
    llm = ChatOpenAI()

    sql_chain = (
        RunnablePassthrough.assign(schema=get_schema)
        | sql_prompt
        | llm.bind(stop="\nSQL Result:")
        | StrOutputParser()
    )

    def run_query(query):
        return db.run(query)

    # Response generation template
    response_template = """Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
    {schema}
    Question: {question}
    SQL Query: {query}
    SQL Response: {response}"""

    response_prompt = ChatPromptTemplate.from_template(response_template)

    full_chain = (
        RunnablePassthrough.assign(query=sql_chain).assign(
            schema=get_schema, response=lambda variables: run_query(variables["query"])
        )
        | response_prompt
        | llm.bind(stop="\nNatural Language Response:")
    )
    return full_chain

rag_chain = create_rag_chain()

# Webhook endpoint for WhatsApp
@app.post("/webhook")
async def webhook(request: Request):
    try:
        # Parse the incoming payload
        payload = await request.json()
        print(f"Received payload: {payload}")

        if "entry" in payload:
            for entry in payload["entry"]:
                changes = entry.get("changes", [])
                for change in changes:
                    value = change.get("value", {})
                    contacts = value.get("contacts", [])
                    for contact in contacts:
                        user_name = contact.get("profile", {}).get("name")
                        wa_id = contact.get("wa_id")
                        messages = value.get("messages", [])
                        for message in messages:
                            message_body = message.get("text", {}).get("body", "No text provided")

                         # Process the incoming message using RAG
                        question = message_body
                        result = rag_chain.invoke({"question": question})

                        # Extract the text content from the AIMessage object
                        response_message = result.content.strip() if hasattr(result, "content") else str(result)

                        # Send the response back via WhatsApp
                        send_whatsapp_message(wa_id, response_message)


        return {"status": "success", "message": "Webhook processed successfully"}
    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=400, detail="Failed to process webhook")

# Run the app (if running directly)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
