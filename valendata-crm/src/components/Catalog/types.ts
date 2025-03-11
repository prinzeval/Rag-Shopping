// types.ts

// Message type for chat conversations
export interface Message {
  text: string;
  type: 'customer' | 'agent';
  time: string;
}

// Conversations type: a record of customer IDs to their message arrays
export type Conversations = Record<string, Message[]>;

// Product type for catalog products
export interface Product {
  id: string;
  retailer_id: string;
  name: string;
  description: string;
  price: string; // Price is a string because it includes currency (e.g., "19.99 USD")
  currency: string;
  availability: 'in stock' | 'out of stock' | 'preorder';
  condition: 'new' | 'used' | 'refurbished';
  link: string;
  image_url: string;
  brand: string;
  google_product_category: string;
}

// Catalog type for product catalogs
export interface Catalog {
  id: string;
  name: string;
  description: string;
  vertical: 'commerce' | 'services' | 'travel' | 'restaurants';
  products: Product[];
}

// Type for creating a new catalog
export interface CatalogCreate {
  name: string;
  description: string;
  vertical: 'commerce' | 'services' | 'travel' | 'restaurants';
}

// Type for updating a catalog
export interface CatalogUpdate {
  id: string;
  name: string;
  description: string;
}

// Type for creating a new product
export interface ProductCreate {
  catalog_id: string;
  retailer_id: string;
  name: string;
  description: string;
  price: string; // Price is a string because it includes currency (e.g., "19.99 USD")
  currency: string;
  availability: 'in stock' | 'out of stock' | 'preorder';
  condition: 'new' | 'used' | 'refurbished';
  link: string;
  image_url: string;
  brand: string;
  google_product_category: string;
}

// Type for updating a product
export interface ProductUpdate {
  id: string;
  retailer_id: string;
  name: string;
  description: string;
  price: string; // Price is a string because it includes currency (e.g., "19.99 USD")
  currency: string;
  availability: 'in stock' | 'out of stock' | 'preorder';
  condition: 'new' | 'used' | 'refurbished';
  link: string;
  image_url: string;
  brand: string;
  google_product_category: string;
}

// API Response types
export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

// Type for API error responses
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}