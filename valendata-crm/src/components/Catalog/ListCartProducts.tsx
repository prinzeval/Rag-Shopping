import React, { useState, useEffect } from 'react';

interface ListCartProductsProps {
  catalogId: string;
}

const ListCartProducts: React.FC<ListCartProductsProps> = ({ catalogId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<any>(null);

  // API base URL - must match your FastAPI server
  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setResponseDetails(null);

    try {
      const url = `${API_BASE_URL}/catalogs/${catalogId}/products`;
      console.log(`Fetching products from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Store response details for debugging
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
          console.log("Parsed data:", data);

          // Check if data has the expected structure
          if (data && Array.isArray(data.products)) {
            setProducts(data.products);
          } else {
            console.warn("Response doesn't contain product array:", data);
            setProducts([]);
          }
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          throw new Error(`Failed to parse server response as JSON. Server returned: ${responseText.substring(0, 100)}...`);
        }
      } else {
        console.warn("Empty response received");
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to load products: ${error.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [catalogId]);

  return (
    <div className="list-products-container">
      <h3>Products in Catalog</h3>
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          {responseDetails && (
            <div className="error-details">
              <h4>Response Details:</h4>
              <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
            </div>
          )}
          <button className="retry-button" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <div className="loading-indicator">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products available in this catalog.</p>
              <div className="empty-state-icon">📦</div>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-card-header">
                  <h4>{product.name}</h4>
                </div>
                <p className="product-description">
                  {product.description || 'No description available'}
                </p>
                <div className="product-card-footer">
                  <span>Price: {product.price}</span>
                  <span>Brand: {product.brand}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListCartProducts;