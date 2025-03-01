# 📄 Facebook Catalog API: Full Documentation (Create, Add Products, Update, Delete, List All)

This documentation covers all essential operations for Facebook Product Catalog API:

- ✅ Create a Catalog
- ✅ Add Products to Catalog
- ✅ Update a Catalog
- ✅ Delete a Catalog
- ✅ List All Catalogs

## 📌 1. Prerequisites

Before you begin, ensure you have:

- ✔ A Facebook Business Manager Account
- ✔ A Valid Access Token with the following permissions:
    - `catalog_management`
    - `business_management`
- ✔ A Business ID (used to create a catalog under your Business Manager)

### 1️⃣ Create a Catalog

**➡️ Endpoint:**

```bash
POST https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_product_catalogs
```

**📍 Required Parameters:**

| Parameter     | Type   | Description                              |
|---------------|--------|------------------------------------------|
| name          | String | The catalog name                         |
| vertical      | String | The type of catalog (commerce, hotel, flight, destination, etc.) |
| access_token  | String | Your valid access token                  |

**📝 Example Request (Python)**

```python
import requests

access_token = 'YOUR_ACCESS_TOKEN'
business_id = 'YOUR_BUSINESS_ID'
base_url = 'https://graph.facebook.com/v19.0'

url = f"{base_url}/{business_id}/owned_product_catalogs"

data = {
        'name': 'My Online Store Catalog',
        'vertical': 'commerce',  # For e-commerce products
        'access_token': access_token
}

response = requests.post(url, json=data)

if response.status_code == 200:
        catalog_id = response.json().get('id')
        print(f"✅ Catalog Created Successfully! Catalog ID: {catalog_id}")
else:
        print(f"❌ Error Creating Catalog: {response.text}")
```

### 2️⃣ Add Products to Catalog

**➡️ Endpoint:**

```bash
POST https://graph.facebook.com/v19.0/{CATALOG_ID}/products
```

**📍 Required Parameters:**

| Parameter                | Type   | Description                              |
|--------------------------|--------|------------------------------------------|
| retailer_id              | String | Unique product identifier (e.g., SKU)    |
| title                    | String | Product name                             |
| description              | String | Product details                          |
| availability             | String | Product availability (in stock, out of stock) |
| condition                | String | Product condition (new, used)            |
| price                    | String | Product price in "XX.XX USD" format      |
| currency                 | String | Currency code (e.g., USD)                |
| link                     | String | Product webpage URL                      |
| image_link               | String | Product image URL                        |
| brand                    | String | Brand name                               |
| google_product_category  | String | Google product category                  |
| access_token             | String | Your valid access token                  |

**📝 Example Request (Python)**

```python
import requests

access_token = 'YOUR_ACCESS_TOKEN'
catalog_id = 'YOUR_CATALOG_ID'
base_url = 'https://graph.facebook.com/v19.0'

url = f"{base_url}/{catalog_id}/products"

product_data = {
        'retailer_id': '12345',  # Unique product ID
        'title': 'Blue T-Shirt',
        'description': 'A comfortable blue T-shirt made from organic cotton.',
        'availability': 'in stock',
        'condition': 'new',
        'price': '19.99 USD',  
        'currency': 'USD',
        'link': 'https://myshop.com/blue-tshirt',
        'image_link': 'https://example.com/images/blue-tshirt.jpg',
        'brand': 'MyBrand',
        'google_product_category': 'Apparel & Accessories > Clothing > Shirts & Tops',
        'access_token': access_token
}

response = requests.post(url, json=product_data)

if response.status_code == 200:
        print(f"✅ Product Added Successfully! Product ID: {response.json()['id']}")
else:
        print(f"❌ Error Adding Product: {response.text}")
```

### 3️⃣ Update a Catalog Name

**➡️ Endpoint:**

```bash
POST https://graph.facebook.com/v19.0/{CATALOG_ID}
```

**📍 Required Parameters:**

| Parameter     | Type   | Description                              |
|---------------|--------|------------------------------------------|
| name          | String | The new catalog name                     |
| access_token  | String | Your valid access token                  |

**📝 Example Request (Python)**

```python
import requests

access_token = 'YOUR_ACCESS_TOKEN'
catalog_id = 'YOUR_CATALOG_ID'
base_url = 'https://graph.facebook.com/v19.0'

url = f"{base_url}/{catalog_id}"

data = {
        'name': 'Updated Catalog Name',
        'access_token': access_token
}

response = requests.post(url, json=data)

if response.status_code == 200:
        print(f"✅ Catalog Updated Successfully!")
else:
        print(f"❌ Error Updating Catalog: {response.text}")
```

### 4️⃣ Delete a Catalog

**➡️ Endpoint:**

```bash
DELETE https://graph.facebook.com/v19.0/{CATALOG_ID}
```

**📍 Required Parameters:**

| Parameter     | Type   | Description                              |
|---------------|--------|------------------------------------------|
| access_token  | String | Your valid access token                  |

**📝 Example Request (Python)**

```python
import requests

access_token = 'YOUR_ACCESS_TOKEN'
catalog_id = 'CATALOG_ID_TO_DELETE'
base_url = 'https://graph.facebook.com/v19.0'

url = f"{base_url}/{catalog_id}"

response = requests.delete(url, params={'access_token': access_token})

if response.status_code == 200:
        print(f"✅ Catalog Deleted Successfully!")
else:
        print(f"❌ Error Deleting Catalog: {response.text}")
```

### 5️⃣ List All Catalogs in a Business Manager

**➡️ Endpoint:**

```bash
GET https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_product_catalogs
```

**📍 Required Parameters:**

| Parameter     | Type   | Description                              |
|---------------|--------|------------------------------------------|
| access_token  | String | Your valid access token                  |

**📝 Example Request (Python)**

```python
import requests

access_token = 'YOUR_ACCESS_TOKEN'
business_id = 'YOUR_BUSINESS_ID'
base_url = 'https://graph.facebook.com/v19.0'

url = f"{base_url}/{business_id}/owned_product_catalogs"

response = requests.get(url, params={'access_token': access_token})

if response.status_code == 200:
        catalogs = response.json().get('data', [])
        for catalog in catalogs:
                print(f"📦 Catalog ID: {catalog['id']}, Name: {catalog['name']}")
else:
        print(f"❌ Error Fetching Catalogs: {response.text}")
```

## 📌 6. Useful Links

- 📌 [Facebook Graph API Explorer (for testing API calls)](https://developers.facebook.com/tools/explorer)
- 📌 [Facebook Catalog API Docs](https://developers.facebook.com/docs/marketing-api/reference/product-catalog)
- 📌 [Facebook Business Manager (Check Your Catalogs)](https://business.facebook.com/settings/catalogs)

## ✅ Summary

| Action          | API Endpoint                        | Request Type |
|-----------------|-------------------------------------|--------------|
| Create Catalog  | /BUSINESS_ID/owned_product_catalogs | POST         |
| Add Product     | /CATALOG_ID/products                | POST         |
| Update Catalog  | /CATALOG_ID                         | POST         |
| Delete Catalog  | /CATALOG_ID                         | DELETE       |
| List Catalogs   | /BUSINESS_ID/owned_product_catalogs | GET          |

🚀 Now you can programmatically manage Facebook catalogs! 🚀
