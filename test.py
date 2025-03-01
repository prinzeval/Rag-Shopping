
# import requests

# # Set up your credentials
# access_token = 'EAAk2WSNlS4oBO0FqEkA1QMOtiNySqZBXj0N30HvAnsthCxyUXiz8FA3hZCzSX9t5ARGYTwan6EDvh4iuhpi5sUQsTDQCaqQAILVcopbRFdUmpHMd9FFrj0nWyOQmJM1ZBItWYZAYvRYXRWSa3LBnnGX6EdCZAxNBZBIZBOMaofhkRz2O3WbxLtRnlmg9psmZCZBsuJgcLKPZBYHJqx2wfZBCHGQx96DkP9NDEsiaLgZD'  # Replace with your valid access token
# catalog_id = '1955964895236699'  # Replace with your catalog ID
# base_url = 'https://graph.facebook.com/v19.0'  # Use the latest API version

# # Helper function to make API requests
# def make_api_request(method, endpoint, data=None):
#     url = f"{base_url}/{endpoint}"
#     headers = {'Content-Type': 'application/json'}
#     params = {'access_token': access_token}

#     response = requests.request(method, url, headers=headers, params=params, json=data)
    
#     if response.status_code != 200:
#         print(f"❌ API Error ({response.status_code}): {response.text}")
#         return None

#     return response.json()

# # Function to add a product to the catalog
# def add_product_to_catalog(product_data):
#     """Add a product to the Facebook Product Catalog."""
#     endpoint = f"{catalog_id}/products"

#     # Convert price to correct format and separate currency
#     price_value, currency = product_data['price'].split()
#     product_data['price'] = f"{int(float(price_value))}"  # Convert price to integer
#     product_data['currency'] = currency  # Separate currency

#     response = make_api_request('POST', endpoint, data=product_data)
    
#     if response:
#         print(f"✅ Product added successfully: {response}")
#     return response

# # Example Usage
# if __name__ == "__main__":
#     product_data = {
#         'retailer_id': '12345',  # Unique product ID (e.g., SKU)
#         'name': 'Blue T-Shirt',  # ✅ FIX: Changed `title` to `name`
#         'description': 'A comfortable blue T-shirt made from organic cotton.',
#         'availability': 'in stock',
#         'condition': 'new',
#         'price': '19.99 USD',  # Fix: Price should be an integer (e.g., "19" instead of "19.99")
#         'link': 'https://mytvv.net/home',
#         'image_url': 'https://outoforder.in/wp-content/uploads/2020/03/mens-blue-t-shirt.jpg.jpg',
#         'brand': 'MyBrand',
#         'google_product_category': 'Apparel & Accessories > Clothing > Shirts & Tops',
#     }

#     # Add the product to the catalog
#     try:
#         product_id = add_product_to_catalog(product_data)
#         if product_id:
#             print(f"✅ Product added successfully! Product ID: {product_id}")
#     except Exception as e:
#         print(f"❌ Error: {e}")




import requests

# Credentials
ACCESS_TOKEN = "EAAk2WSNlS4oBOwyZAxZCQtSenlx2JaoXT7ZB2mjTCfhZCFxTUVZC2ZAUISUkEqEhg2zZAuavlWVl5S1iJxuZCLrBVvZCZARaEVu31oiZAYqysUWxz1LqkqPXgdqeIZBYVAVZCKrCxZB92bHMoUqB2k3slEXBCNcZBkXPHq9b4T3jaAXlyLvMrxq5Vk2EZCxoRg7NsqGAQqrWhsKTHTJZBVLH3Y1VnTj2Am2ocMAXJJ42yuVwZD"
BUSINESS_ID = "1887710258302426"
BASE_URL = "https://graph.facebook.com/v19.0"

# Function to create a product catalog
def create_product_catalog(name="My Catalog", vertical="commerce"):
    endpoint = f"{BUSINESS_ID}/owned_product_catalogs"
    data = {
        "name": name,
        "vertical": vertical,
        "access_token": ACCESS_TOKEN,
    }

    response = requests.post(f"{BASE_URL}/{endpoint}", json=data)
    if response.status_code == 200:
        catalog_id = response.json().get("id")
        print(f"✅ Created Product Catalog: {catalog_id}")
        return catalog_id
    else:
        print(f"❌ Error Creating Product Catalog: {response.text}")
        return None

# Example Usage
catalog_id = create_product_catalog()
