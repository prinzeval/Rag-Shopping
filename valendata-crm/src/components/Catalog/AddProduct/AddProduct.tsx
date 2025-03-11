import React, { useState } from 'react';
import './addproduct.css';

interface AddProductProps {
  catalogId: string;
  onProductAdded: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ catalogId, onProductAdded }) => {
  const API_BASE_URL = 'http://localhost:8000/api';
  
  const [product, setProduct] = useState({
    name: '',
    image_url: '',
    // Optional fields with empty defaults
    retailer_id: '',
    description: '',
    price: '',
    currency: 'USD',
    availability: 'in stock',
    condition: 'new',
    link: '',
    brand: '',
    google_product_category: '',
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<any>(null);
  
  // Show only required fields by default
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

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
      // Check required fields
      if (!product.name || !product.image_url) {
        throw new Error('Product name and image URL are required');
      }
      
      // Format price string if provided
      const formattedProduct = {
        ...product,
      };
      
      // Only add price if it exists
      if (product.price) {
        formattedProduct.price = `${product.price} ${product.currency}`;
      }
      
      const url = `${API_BASE_URL}/catalogs/${catalogId}/products`;
      console.log(`Adding product at: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formattedProduct),
      });
      
      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      };
      setResponseDetails(responseInfo);
      console.log('Response details:', responseInfo);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200) + '...');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${responseText}`);
      }
      
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
        {/* Required Fields */}
        <div className="form-group">
          <label>Product Name <span className="required">*</span></label>
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
          <label>Image URL <span className="required">*</span></label>
          <input
            type="url"
            value={product.image_url}
            onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
            placeholder="Enter image URL"
            required
            disabled={loading}
          />
        </div>
        
        {/* Toggle button for optional fields */}
        <button 
          type="button" 
          className="toggle-fields-button"
          onClick={() => setShowOptionalFields(!showOptionalFields)}
        >
          {showOptionalFields ? 'Hide Optional Fields' : 'Show Optional Fields'}
        </button>
        
        {/* Optional Fields */}
        {showOptionalFields && (
          <div className="optional-fields">
            <div className="form-group">
              <label>Retailer ID</label>
              <input
                type="text"
                value={product.retailer_id}
                onChange={(e) => setProduct({ ...product, retailer_id: e.target.value })}
                placeholder="Enter unique retailer ID (optional)"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter product description (optional)"
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
                  placeholder="Enter price (optional)"
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
                placeholder="Enter product URL (optional)"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={product.brand}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                placeholder="Enter brand (optional)"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Google Product Category</label>
              <input
                type="text"
                value={product.google_product_category}
                onChange={(e) => setProduct({ ...product, google_product_category: e.target.value })}
                placeholder="Enter Google product category (optional)"
                disabled={loading}
              />
            </div>
          </div>
        )}
        
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