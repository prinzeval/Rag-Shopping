import React, { useState } from 'react';
import './addproduct.css';

interface AddProductProps {
  catalogId: string;
  onProductAdded: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ catalogId, onProductAdded }) => {
  // Add this constant to match other components
  const API_BASE_URL = 'http://localhost:8000/api';
  
  const [product, setProduct] = useState({
    retailer_id: '',
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    availability: 'in stock',
    condition: 'new',
    link: '',
    image_url: '',
    brand: '',
    google_product_category: '',
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<any>(null);

  const handlePriceChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9.]/g, '');
    setProduct({ ...product, price: numericValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseDetails(null);
    
    try {
      // Format price string as expected by the API "price currency"
      const formattedProduct = {
        ...product,
        price: `${product.price} ${product.currency}`,
      };
      
      // Use the full URL with base path
      const url = `${API_BASE_URL}/catalogs/${catalogId}/products`;
      console.log(`Adding product at: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Include credentials like your other components
        body: JSON.stringify(formattedProduct),
      });
      
      // Store response details for debugging, like in your other components
      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      };
      setResponseDetails(responseInfo);
      console.log('Response details:', responseInfo);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200) + '...');
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${responseText}`);
      }
      
      // Try to parse JSON only if there's content
      if (responseText.trim()) {
        try {
          const data = JSON.parse(responseText);
          console.log('Product added:', data);
          onProductAdded();
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          throw new Error(`Failed to parse server response as JSON. Server returned: ${responseText.substring(0, 100)}...`);
        }
      } else {
        console.warn("Empty response received");
        onProductAdded(); // Assuming success if we got 200 OK
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      <h3>Add Product to Catalog</h3>
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          {responseDetails && (
            <div className="error-details">
              <h4>Response Details:</h4>
              <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Rest of your form remains the same */}
        <div className="form-group">
          <label>Retailer ID</label>
          <input
            type="text"
            value={product.retailer_id}
            onChange={(e) => setProduct({ ...product, retailer_id: e.target.value })}
            placeholder="Enter unique retailer ID"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Enter product name"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Enter product description"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label>Price</label>
            <input
              type="text"
              value={product.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="Enter price (e.g. 19.99)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group half">
            <label>Currency</label>
            <select
              value={product.currency}
              onChange={(e) => setProduct({ ...product, currency: e.target.value })}
              disabled={loading}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label>Availability</label>
            <select
              value={product.availability}
              onChange={(e) => setProduct({ ...product, availability: e.target.value })}
              disabled={loading}
            >
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="preorder">Preorder</option>
            </select>
          </div>
          
          <div className="form-group half">
            <label>Condition</label>
            <select
              value={product.condition}
              onChange={(e) => setProduct({ ...product, condition: e.target.value })}
              disabled={loading}
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Product Link</label>
          <input
            type="url"
            value={product.link}
            onChange={(e) => setProduct({ ...product, link: e.target.value })}
            placeholder="Enter product URL"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={product.image_url}
            onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
            placeholder="Enter image URL"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            placeholder="Enter brand"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Google Product Category</label>
          <input
            type="text"
            value={product.google_product_category}
            onChange={(e) => setProduct({ ...product, google_product_category: e.target.value })}
            placeholder="Enter Google product category"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;