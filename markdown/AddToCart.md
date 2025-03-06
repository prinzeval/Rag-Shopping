# 📌 Facebook Product Catalog API - Full Documentation & Breakdown

This guide will cover how to add a product to a Facebook Catalog using Python and the Graph API.

## ✅ 1. Prerequisites

Before you can start adding products to your catalog, ensure you have the following:

### 1.1 Facebook Developer Account
➡️ Sign up here: [Facebook Developer](https://developers.facebook.com/)

### 1.2 Facebook Business Manager Account
➡️ Go to Business Manager: [Business Manager](https://business.facebook.com/)

### 1.3 A Facebook Product Catalog
➡️ Create a catalog here: [Commerce Manager](https://business.facebook.com/commerce_manager)

### 1.4 Facebook Access Token (for API Authentication)
To interact with the Facebook API, you need a User Access Token or a System User Token with the required permissions.

➡️ Get an access token from Graph API Explorer: [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

#### Permissions Required
When generating your access token, ensure it has the following scopes:
- ✅ whatsapp_business_management
- ✅ whatsapp_business_messaging
- ✅ catalog_management
- ✅ public_profile

## ✅ 2. Key API Endpoints

Here are the main API endpoints you will use:

| Action                  | Endpoint                  | Method |
|-------------------------|---------------------------|--------|
| Add Product to Catalog  | /{catalog_id}/products    | POST   |
| Get Product Details     | /{product_id}             | GET    |
| Update Product          | /{product_id}             | POST   |
| Delete Product          | /{product_id}             | DELETE |

📌 Base URL for all requests: `https://graph.facebook.com/v19.0`

## ✅ 3. Adding a Product to the Catalog

### 3.1 Required Parameters

To add a product, your request must include:

| Parameter               | Description                       | Example                              |
|-------------------------|-----------------------------------|--------------------------------------|
| retailer_id             | Unique ID for the product (SKU)   | "12345"                              |
| name                    | Name of the product               | "Blue T-Shirt"                       |
| description             | Product description               | "A comfortable T-shirt"              |
| availability            | Stock status (in stock, out of stock, etc.) | "in stock"                    |
| condition               | Product condition (new, used, etc.) | "new"                             |
| price                   | Product price (integer, in cents) | "1999" (for $19.99)                  |
| currency                | Currency (ISO 4217 code)          | "USD"                                |
| link                    | Product page URL                  | "https://example.com/tshirt"         |
| image_link              | Image URL of the product          | "https://example.com/tshirt.jpg"     |
| brand                   | Brand name                        | "MyBrand"                            |
| google_product_category | Google category ID                | "Apparel & Accessories > Clothing > Shirts & Tops" |

📌 Official Facebook API Documentation: [Catalog API](https://developers.facebook.com/docs/marketing-api/catalog-api)

## ✅ 4. API Request to Add a Product

### 4.1 Example API Request (POST)

Here is the request format:

```python
import requests

# Set up credentials
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"
CATALOG_ID = "YOUR_CATALOG_ID"
BASE_URL = "https://graph.facebook.com/v19.0"

# API request function
def make_api_request(method, endpoint, data=None):
    url = f"{BASE_URL}/{endpoint}"
    headers = {"Content-Type": "application/json"}
    params = {"access_token": ACCESS_TOKEN}

    response = requests.request(method, url, headers=headers, params=params, json=data)
    if response.status_code != 200:
        print(f"❌ API Error ({response.status_code}): {response.text}")
        return None
    return response.json()

# Function to add a product
def add_product_to_catalog(product_data):
    endpoint = f"{CATALOG_ID}/products"

    # Convert price format (Facebook API expects price in cents)
    price_value, currency = product_data["price"].split()
    product_data["price"] = f"{int(float(price_value) * 100)}"  # Convert price to integer (e.g., 19.99 -> 1999)
    product_data["currency"] = currency  # Separate currency

    response = make_api_request("POST", endpoint, data=product_data)
    if response:
        print(f"✅ Product added successfully: {response}")
    return response

# Example Usage
if __name__ == "__main__":
    product_data = {
        "retailer_id": "12345",
        "name": "Blue T-Shirt",
        "description": "A comfortable blue T-shirt made from organic cotton.",
        "availability": "in stock",
        "condition": "new",
        "price": "19.99 USD",  # Facebook expects price as an integer in cents
        "link": "https://example.com/blue-tshirt",
        "image_link": "https://example.com/blue-tshirt.jpg",
        "brand": "MyBrand",
        "google_product_category": "Apparel & Accessories > Clothing > Shirts & Tops",
    }

    try:
        product_id = add_product_to_catalog(product_data)
        if product_id:
            print(f"✅ Product added successfully! Product ID: {product_id}")
    except Exception as e:
        print(f"❌ Error: {e}")
```

## ✅ 5. Testing & Debugging

Run the script using:

```sh
python test.py
```

If successful, you should see:

```bash
✅ Product added successfully: {'id': '9407737845969352'}
✅ Product added successfully! Product ID: {'id': '9407737845969352'}
```

If you encounter errors:
- Check if your access token is valid (Test here)
- Ensure your catalog ID is correct (Find it in Commerce Manager)
- Make sure product fields are correct (Reference)

## ✅ 6. Next Steps

Once you’ve added a product, you might want to:
- Update a product → /{product_id} (POST)
- Fetch all products in a catalog → /{catalog_id}/products (GET)
- Delete a product → /{product_id} (DELETE)





📄 Facebook Catalog API Documentation: Creating & Deleting a Catalog
The Facebook Product Catalog API allows businesses to programmatically create, manage, and delete catalogs. Below is a breakdown of how to create and delete a catalog using the Facebook Graph API.

📌 1. Prerequisites
Before you can create a catalog via the API, you need:
✅ A Facebook Business Manager Account
✅ A Valid Access Token with the following permissions:

catalog_management
business_management
✅ A Business ID (used to create a catalog under your Business Manager)
📌 2. Creating a Catalog
To create a catalog, make a POST request to:

bash
Copy
Edit
https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_product_catalogs
📍 Required Parameters:
Parameter	Type	Description
name	String	The catalog name
vertical	String	The type of catalog (e.g., commerce, hotel, flight, destination)
access_token	String	Your valid access token
📝 Example Request (Python)
python
Copy
Edit
import requests

# Credentials
access_token = 'YOUR_ACCESS_TOKEN'
business_id = 'YOUR_BUSINESS_ID'
base_url = 'https://graph.facebook.com/v19.0'

# API endpoint
url = f"{base_url}/{business_id}/owned_product_catalogs"

# Catalog data
data = {
    'name': 'My New Catalog',
    'vertical': 'commerce',  # For e-commerce catalogs
    'access_token': access_token
}

# Make the API request
response = requests.post(url, json=data)

# Handle response
if response.status_code == 200:
    catalog_id = response.json().get('id')
    print(f"✅ Catalog Created Successfully! Catalog ID: {catalog_id}")
else:
    print(f"❌ Error Creating Catalog: {response.text}")
📌 3. Deleting a Catalog
To delete a catalog, make a DELETE request to:

arduino
Copy
Edit
https://graph.facebook.com/v19.0/{CATALOG_ID}
📍 Required Parameters:
Parameter	Type	Description
access_token	String	Your valid access token
📝 Example Request (Python)
python
Copy
Edit
import requests

# Credentials
access_token = 'YOUR_ACCESS_TOKEN'
catalog_id = 'CATALOG_ID_TO_DELETE'
base_url = 'https://graph.facebook.com/v19.0'

# API endpoint
url = f"{base_url}/{catalog_id}"

# API request to delete catalog
response = requests.delete(url, params={'access_token': access_token})

# Handle response
if response.status_code == 200:
    print(f"✅ Catalog Deleted Successfully!")
else:
    print(f"❌ Error Deleting Catalog: {response.text}")
📌 4. Getting a List of Your Catalogs
To fetch all catalogs under your Business Manager, make a GET request to:

bash
Copy
Edit
https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_product_catalogs?access_token=YOUR_ACCESS_TOKEN
📝 Example Request (Python)
python
Copy
Edit
import requests

# Credentials
access_token = 'YOUR_ACCESS_TOKEN'
business_id = 'YOUR_BUSINESS_ID'
base_url = 'https://graph.facebook.com/v19.0'

# API endpoint
url = f"{base_url}/{business_id}/owned_product_catalogs"

# API request to get catalogs
response = requests.get(url, params={'access_token': access_token})

# Handle response
if response.status_code == 200:
    catalogs = response.json().get('data', [])
    for catalog in catalogs:
        print(f"📦 Catalog ID: {catalog['id']}, Name: {catalog['name']}")
else:
    print(f"❌ Error Fetching Catalogs: {response.text}")
📌 5. Useful Links
📌 Facebook Graph API Explorer (for testing API calls)
👉 https://developers.facebook.com/tools/explorer

📌 Facebook Catalog API Docs
👉 https://developers.facebook.com/docs/marketing-api/reference/product-catalog

📌 Facebook Business Manager (Check Your Catalogs)
👉 https://business.facebook.com/settings/catalogs

✅ Summary
Action	API Endpoint	Request Type
Create Catalog	/BUSINESS_ID/owned_product_catalogs	POST
Delete Catalog	/CATALOG_ID	DELETE
List Catalogs	/BUSINESS_ID/owned_product_catalogs	GET
🚀 Now you can programmatically create and delete Facebook catalogs! 🚀







