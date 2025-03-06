
# import requests

# # Credentials
# ACCESS_TOKEN = "EAAk2WSNlS4oBOZCuPlmFlrcYdYZAilSnGJvuwRf3JvwJlbbTuxbQ04Nv43V9OFWZB5Y03lZAN0YDJJ25wZAjG3vMQuPCYAd43Xey06QKAi3i7nVZCTEEBvPDFMgK3qo0ZBk7Y7UElYYPjMEvVnzMM6IkxobU7udZBFciDDfc1A8ZAKWICMd7RAGViPZB3v4IENh1wrY9kceFkwZA4n21BQ1ZA7FZBJTqAFk5QmnbvD7wZD"
# BUSINESS_ID = "1887710258302426"
# BASE_URL = "https://graph.facebook.com/v19.0"

# # Function to create a product catalog
# def create_product_catalog(name="Val's Cart", vertical="commerce"):
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












# import requests

# # Set up your credentials
# access_token = 'EAAk2WSNlS4oBOZCuPlmFlrcYdYZAilSnGJvuwRf3JvwJlbbTuxbQ04Nv43V9OFWZB5Y03lZAN0YDJJ25wZAjG3vMQuPCYAd43Xey06QKAi3i7nVZCTEEBvPDFMgK3qo0ZBk7Y7UElYYPjMEvVnzMM6IkxobU7udZBFciDDfc1A8ZAKWICMd7RAGViPZB3v4IENh1wrY9kceFkwZA4n21BQ1ZA7FZBJTqAFk5QmnbvD7wZD'  # Replace with your valid access token
# catalog_id = '657845773292359'  # Replace with your catalog ID
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
#     product_data_list = [
#         {
#             "retailer_id": "12345",
#             "name": "Blue T-Shirt",
#             "description": "A comfortable blue T-shirt made from organic cotton.",
#             "availability": "in stock",
#             "condition": "new",
#             "price": "19 USD",
#             "link": "https://mytvv.net/home",
#             "image_url": "https://outoforder.in/wp-content/uploads/2020/03/mens-blue-t-shirt.jpg.jpg",
#             "brand": "MyBrand",
#             "google_product_category": "Apparel & Accessories > Clothing > Shirts & Tops"
#         },
#         {
#             "retailer_id": "12346",
#             "name": "Red Hoodie",
#             "description": "A cozy red hoodie made from organic cotton.",
#             "availability": "in stock",
#             "condition": "new",
#             "price": "29 USD",
#             "link": "https://mytvv.net/red-hoodie",
#             "image_url": "https://m.media-amazon.com/images/I/51tEciwZARL._AC_SX385_.jpg",
#             "brand": "MyBrand",
#             "google_product_category": "Apparel & Accessories > Clothing > Outerwear"
#         },
#         {
#             "retailer_id": "12347",
#             "name": "Black Jeans",
#             "description": "Stylish black jeans made from premium denim.",
#             "availability": "in stock",
#             "condition": "new",
#             "price": "49 USD",
#             "link": "https://mytvv.net/black-jeans",
#             "image_url": "https://m.media-amazon.com/images/I/71SlmFbOIML._AC_SY445_.jpg",
#             "brand": "MyBrand",
#             "google_product_category": "Apparel & Accessories > Clothing > Pants"
#         },
#         {
#             "retailer_id": "12348",
#             "name": "Green Cap",
#             "description": "A trendy green cap with adjustable strap.",
#             "availability": "in stock",
#             "condition": "new",
#             "price": "15 USD",
#             "link": "https://mytvv.net/green-cap",
#             "image_url": "https://m.media-amazon.com/images/I/81NhHiafdWL._AC_SX466_.jpg",
#             "brand": "MyBrand",
#             "google_product_category": "Apparel & Accessories > Clothing > Hats"
#         },
#         {
#             "retailer_id": "12349",
#             "name": "White Sneakers",
#             "description": "Comfortable white sneakers with rubber soles.",
#             "availability": "in stock",
#             "condition": "new",
#             "price": "59 USD",
#             "link": "https://mytvv.net/white-sneakers",
#             "image_url": "https://m.media-amazon.com/images/I/61Pv7rzDiDL._AC_UL320_.jpg",
#             "brand": "MyBrand",
#             "google_product_category": "Apparel & Accessories > Shoes > Sneakers"
#         }
#     ]

#     # Add each product to the catalog
#     for product_data in product_data_list:
#         try:
#             response = add_product_to_catalog(product_data)
#             if response:
#                 print(f"✅ Product added successfully: {response}")
#         except Exception as e:
#             print(f"❌ Error: {e}")






# import requests

# access_token = 'EAAk2WSNlS4oBO2ej3Q7k4l2PeTXZBCJMCQwOvaHkKoQ5vztMxaPOsqZBeynKLSrbI45jzvlZCMGGukyZC1YqV9iMC3Jk1vKnrtfxoympYZAZCvYzH85uYNGDZCZB0OWHwtLAXvw3SZCbcqPfnZBlVtuFCw64vTNNxviBcbaWlzW5hIOpQ6mRcqQqPieIlPNFIQZAczQX7ZAn4nRv18RYfTbMdZB1upYNjaiyu4o6HW12f8g5eG9NUV3cl5uYZD'  # Replace with your valid access token
# catalog_id = '1838394003577062'  # Replace with your catalog ID
# base_url = 'https://graph.facebook.com/v19.0'

# url = f"{base_url}/{catalog_id}"

# response = requests.delete(url, params={'access_token': access_token})

# if response.status_code == 200:
#     print(f"✅ Catalog Deleted Successfully!")
# else:
#     print(f"❌ Error Deleting Catalog: {response.text}")




# import requests
# access_token = 'EAAk2WSNlS4oBO2Ku98f7ZCnH6ljm34IthhDa23biNzZA9fEmxqKxSDW5JMOyzwGdj8LRaFU5uA8g5vdKv8Tcq8Wz7b1JnVf2ZA1ghw3jLEyAieVP9TV4Y6ZCDn4tZAV7JiER8uB8D0VUITjK4PKxXdZAuOJx4UkYDLMkZCoG4tYwUSp4JA5P0nNZBbFwpG45XqByhpXRtr59kbZAQ8U2G7FtEI4BNWMg3s1aVPQ4ZD'
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

# access_token = 'EAAk2WSNlS4oBO3REZCGG9ykQkxgtKzWvHrRWNDQ47VgQyVH3QTOJbf2XO8KiLFYG3a793VJZAfshh3UuetJ5vr6IHi0XroYKglDIMA3kkHfUR11al0DZARLfR008uTxu56UmZCdqJu5URDoy4PXtNSCmnrRDjbB6V7ze9nUMKgvpckL9S259oPUt2piXM0BuM4TUOes8pJqLaC8ouZCZATvI83OwHiZBFFIxZACupaavpxj79LwMLyzt'
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
