
# import requests

# # Credentials
# ACCESS_TOKEN = "EAAk2WSNlS4oBOZBXZC07KSlDbBH4ddd0ZBW1R3N6xUXrf5csSkivNwvjNdIKdtRtH87cRBsU8jVqJ8qpdEZAWt7Srhynazni7vQZA6QzGSkNk8T44fxD2mNYkZB8odCdHzsOxUpZC6YrxdhMkyLpQLJLWMh6JcDtqLLpfbfXOX1cbf9EopnTQ6sBKankA5RZBnfMntEosgPXOOc7ANGikUXNJbnm7wTMGNyomLADlmasr1yq3tUxcGIZD"
# BUSINESS_ID = "1887710258302426"
# BASE_URL = "https://graph.facebook.com/v19.0"

# # Function to create a product catalog
# def create_product_catalog(name="num1 cart", vertical="commerce"):
#     endpoint = f"{BUSINESS_ID}/owned_product_catalogs"
#     data = {
#         "name": name,
#         "vertical": vertical,
#         "access_token": ACCESS_TOKEN,
#     }

#     response = requests.post(f"{BASE_URL}/{endpoint}", json=data)
#     if response.status_code == 200:
#         catalog_id = response.json().get("id")
#         print(f"✅ Created Product Catalog: {catalog_id}")
#         return catalog_id
#     else:
#         print(f"❌ Error Creating Product Catalog: {response.text}")
#         return None

# # Example Usage
# catalog_id = create_product_catalog()












import requests

# Set up your credentials
access_token = 'EAAk2WSNlS4oBOxIT1OP5HXq80X9Co6rmInl3sbivq8fUHuFOq9Lc2tzemxzF5Bq0ev8kfItnt4wzhwmOk2ZBvD1M0iwWAh5TADqso5VEx5DmkVmOkZBlejnrfNmUqS6DXLomQZB7mySMtfOwsIxoZCwVd1TaP4txVNT0NgS7loZCr6M7E1AZCGZCpXQdFSyp6MeQMyEe3SLRIAX2gTPQka7fdawLm19yuvTCUZCWFxLmK4PbqH2eT5gK'  # Replace with your valid access token
catalog_id = '657845773292359'  # Replace with your catalog ID
base_url = 'https://graph.facebook.com/v19.0'  # Use the latest API version

# Helper function to make API requests
def make_api_request(method, endpoint, data=None):
    url = f"{base_url}/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    params = {'access_token': access_token}

    response = requests.request(method, url, headers=headers, params=params, json=data)
    
    if response.status_code != 200:
        print(f"❌ API Error ({response.status_code}): {response.text}")
        return None

    return response.json()



# Function to add a product to the catalog
def add_product_to_catalog(product_data):
    """Add a product to the Facebook Product Catalog with minimum required fields."""
    endpoint = f"{catalog_id}/products"
    
    # Check for required fields
    if not product_data.get('name') or not product_data.get('image_url'):
        print("❌ Error: Product name and image_url are required")
        return None
    
    # Generate a retailer_id if not provided
    if not product_data.get('retailer_id'):
        import uuid
        product_data['retailer_id'] = f"product_{uuid.uuid4().hex[:8]}"
    
    # Set defaults for required API fields if missing
    defaults = {
        'description': product_data.get('name', ''),  # Use name as default description
        'availability': 'in stock',
        'condition': 'new',
        'link': 'https://example.com/product',  # Placeholder URL
        'brand': 'Generic',
        'google_product_category': '5181'  # Generic category (Apparel & Accessories)
    }
    
    # Apply defaults for missing fields
    for key, value in defaults.items():
        if not product_data.get(key):
            product_data[key] = value
    
    # Handle price if provided
    if product_data.get('price'):
        try:
            price_value, currency = product_data['price'].split()
            product_data['price'] = f"{int(float(price_value))}"
            product_data['currency'] = currency
        except ValueError:
            # If price format is wrong, set defaults
            product_data['price'] = '0'
            product_data['currency'] = 'USD'
    else:
        # If price not provided
        product_data['price'] = '0'
        product_data['currency'] = 'USD'
    
    response = make_api_request('POST', endpoint, data=product_data)
    
    if response:
        print(f"✅ Product added successfully: {response}")
    return response

# Example Usage
if __name__ == "__main__":
    product_data_list = [
        {
            "retailer_id": "",
            "name": "val picture",
            "description": "",
            "availability": "",
            "condition": "",
            "price": "",
            "link": "",
            "image_url": "https://avatars.githubusercontent.com/u/120737637?v=4",
            "brand": "",
            "google_product_category": ""
        }]
    [
        # {
        #     "retailer_id": "12346",
        #     "name": "Red Hoodie",
        #     "description": "A cozy red hoodie made from organic cotton.",
        #     "availability": "in stock",
        #     "condition": "new",
        #     "price": "29 USD",
        #     "link": "https://mytvv.net/red-hoodie",
        #     "image_url": "https://m.media-amazon.com/images/I/51tEciwZARL._AC_SX385_.jpg",
        #     "brand": "MyBrand",
        #     "google_product_category": "Apparel & Accessories > Clothing > Outerwear"
        # },
        # {
        #     "retailer_id": "12347",
        #     "name": "Black Jeans",
        #     "description": "Stylish black jeans made from premium denim.",
        #     "availability": "in stock",
        #     "condition": "new",
        #     "price": "49 USD",
        #     "link": "https://mytvv.net/black-jeans",
        #     "image_url": "https://m.media-amazon.com/images/I/71SlmFbOIML._AC_SY445_.jpg",
        #     "brand": "MyBrand",
        #     "google_product_category": "Apparel & Accessories > Clothing > Pants"
        # },
        # {
        #     "retailer_id": "12348",
        #     "name": "Green Cap",
        #     "description": "A trendy green cap with adjustable strap.",
        #     "availability": "in stock",
        #     "condition": "new",
        #     "price": "15 USD",
        #     "link": "https://mytvv.net/green-cap",
        #     "image_url": "https://m.media-amazon.com/images/I/81NhHiafdWL._AC_SX466_.jpg",
        #     "brand": "MyBrand",
        #     "google_product_category": "Apparel & Accessories > Clothing > Hats"
        # },
        # {
        #     "retailer_id": "12349",
        #     "name": "White Sneakers",
        #     "description": "Comfortable white sneakers with rubber soles.",
        #     "availability": "in stock",
        #     "condition": "new",
        #     "price": "59 USD",
        #     "link": "https://mytvv.net/white-sneakers",
        #     "image_url": "https://m.media-amazon.com/images/I/61Pv7rzDiDL._AC_UL320_.jpg",
        #     "brand": "MyBrand",
        #     "google_product_category": "Apparel & Accessories > Shoes > Sneakers"
        # }
    ]

    # Add each product to the catalog
    for product_data in product_data_list:
        try:
            response = add_product_to_catalog(product_data)
            if response:
                print(f"✅ Product added successfully: {response}")
        except Exception as e:
            print(f"❌ Error: {e}")






# import requests

# access_token = 'EAAk2WSNlS4oBOZBXZC07KSlDbBH4ddd0ZBW1R3N6xUXrf5csSkivNwvjNdIKdtRtH87cRBsU8jVqJ8qpdEZAWt7Srhynazni7vQZA6QzGSkNk8T44fxD2mNYkZB8odCdHzsOxUpZC6YrxdhMkyLpQLJLWMh6JcDtqLLpfbfXOX1cbf9EopnTQ6sBKankA5RZBnfMntEosgPXOOc7ANGikUXNJbnm7wTMGNyomLADlmasr1yq3tUxcGIZD'  # Replace with your valid access token
# catalog_id = '1838394003577062'  # Replace with your catalog ID
# base_url = 'https://graph.facebook.com/v19.0'

# url = f"{base_url}/{catalog_id}"

# response = requests.delete(url, params={'access_token': access_token})

# if response.status_code == 200:
#     print(f"✅ Catalog Deleted Successfully!")
# else:
#     print(f"❌ Error Deleting Catalog: {response.text}")




# import requests
# access_token = 'EAAk2WSNlS4oBOZBXZC07KSlDbBH4ddd0ZBW1R3N6xUXrf5csSkivNwvjNdIKdtRtH87cRBsU8jVqJ8qpdEZAWt7Srhynazni7vQZA6QzGSkNk8T44fxD2mNYkZB8odCdHzsOxUpZC6YrxdhMkyLpQLJLWMh6JcDtqLLpfbfXOX1cbf9EopnTQ6sBKankA5RZBnfMntEosgPXOOc7ANGikUXNJbnm7wTMGNyomLADlmasr1yq3tUxcGIZD'
# business_id = '1887710258302426'
# base_url = 'https://graph.facebook.com/v19.0'

# url = f"{base_url}/{business_id}/owned_product_catalogs"

# response = requests.get(url, params={'access_token': access_token})

# if response.status_code == 200:
#         catalogs = response.json().get('data', [])
#         for catalog in catalogs:
#                 print(f"📦 Catalog ID: {catalog['id']}, Name: {catalog['name']}")
# else:
#         print(f"❌ Error Fetching Catalogs: {response.text}")  





# import requests

# access_token = 'EAAk2WSNlS4oBOZBXZC07KSlDbBH4ddd0ZBW1R3N6xUXrf5csSkivNwvjNdIKdtRtH87cRBsU8jVqJ8qpdEZAWt7Srhynazni7vQZA6QzGSkNk8T44fxD2mNYkZB8odCdHzsOxUpZC6YrxdhMkyLpQLJLWMh6JcDtqLLpfbfXOX1cbf9EopnTQ6sBKankA5RZBnfMntEosgPXOOc7ANGikUXNJbnm7wTMGNyomLADlmasr1yq3tUxcGIZD'
# catalog_id = '657845773292359'
# base_url = 'https://graph.facebook.com/v19.0'

# url = f"{base_url}/{catalog_id}"

# data = {
#         'name': 'Real cart',
#         'access_token': access_token
# }

# response = requests.post(url, json=data)

# if response.status_code == 200:
#         print(f"✅ Catalog Updated Successfully!")
# else:
#         print(f"❌ Error Updating Catalog: {response.text}")





