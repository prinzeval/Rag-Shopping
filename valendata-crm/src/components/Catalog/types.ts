// types.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
  }
  
  export interface Catalog {
    id: string;
    name: string;
    description: string;
    products: Product[];
  }
  
  export interface CatalogCreate {
    name: string;
    description: string;
    business_id: string;
  }
  
  export interface ProductCreate {
    catalog_id: number;
    retailer_id: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    availability?: string;
    condition?: string;
    image_url: string;
    brand: string;
    google_product_category: string;
  }
  
  export interface CatalogUpdate {
    id: string;
    name: string;
    description: string;
  }
  
  export interface ProductUpdate {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    brand: string;
    google_product_category: string;
  }