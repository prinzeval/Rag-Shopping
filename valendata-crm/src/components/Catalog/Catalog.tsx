import React, { useState, useEffect } from 'react';
import CreateCatalog from './CreateCatalog/CreateCatalog';
import AddProduct from './AddProduct/AddProduct';
import ListCatalog from './ListCatalog/ListCatalog';
import UpdateCatalog from './UpdateCatalog/UpdateCatalog'; // Updated import
import ListCartProducts from './ListCartProducts/ListCartProducts'; // Updated import
import './catalog.css';

const Catalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [activeCatalog, setActiveCatalog] = useState<any>(null);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<any>(null);

  // API base URL - adjust if needed
  const API_BASE_URL = 'http://localhost:8000/api'; // Full URL with port

  // Fetch catalogs from the backend
  const fetchCatalogs = async () => {
    setLoading(true);
    setError(null);
    setResponseDetails(null);

    try {
      const url = `${API_BASE_URL}/catalogs`;
      console.log(`Fetching catalogs from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials if your API requires cookies/auth
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
          console.log('Parsed data:', data);

          // Check if data has the expected structure
          if (data && Array.isArray(data.catalogs)) {
            setCatalogs(data.catalogs);
          } else {
            console.warn("Response doesn't contain catalog array:", data);
            setCatalogs([]);
          }
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          throw new Error(`Failed to parse server response as JSON. Server returned: ${responseText.substring(0, 100)}...`);
        }
      } else {
        console.warn('Empty response received');
        setCatalogs([]);
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error);
      setError(`Failed to load catalogs: ${error.message}`);
      setCatalogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCatalogs();
  }, []);

  // Handle catalog selection
  const handleSelectCatalog = (catalog: any) => {
    setActiveCatalog(catalog);
  };

  // Retry handler
  const handleRetry = () => {
    fetchCatalogs();
  };

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    if (loading) {
      return <div className="loading-indicator">Loading catalogs...</div>;
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">{error}</div>
          {responseDetails && (
            <div className="error-details">
              <h4>Response Details:</h4>
              <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
            </div>
          )}
          <button className="retry-button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'create':
        return <CreateCatalog onCatalogCreated={() => {
          setActiveTab('list');
          fetchCatalogs();
        }} />;
      case 'add-product':
        return activeCatalog ? (
          <AddProduct catalogId={activeCatalog.id} onProductAdded={() => setActiveTab('list')} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      case 'update-catalog':
        return activeCatalog ? (
          <UpdateCatalog catalog={activeCatalog} onCatalogUpdated={() => {
            setActiveTab('list');
            fetchCatalogs();
          }} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      case 'list-products': // Updated case for listing products
        return activeCatalog ? (
          <ListCartProducts catalogId={activeCatalog.id} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      default:
        return (
          <ListCatalog
            catalogs={catalogs}
            activeCatalog={activeCatalog}
            onSelectCatalog={handleSelectCatalog}
            onDeleteCatalog={(id) => {
              setCatalogs(catalogs.filter((cat) => cat.id !== id));
              if (activeCatalog && activeCatalog.id === id) {
                setActiveCatalog(null);
              }
            }}
          />
        );
    }
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2>Product Catalog Management</h2>
        <div className="catalog-tabs">
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('list');
              fetchCatalogs();
            }}
          >
            Catalogs
          </button>
          <button
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Catalog
          </button>
          <button
            className={`tab-button ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
            disabled={!activeCatalog}
          >
            Add Product
          </button>
          <button
            className={`tab-button ${activeTab === 'update-catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('update-catalog')}
            disabled={!activeCatalog}
          >
            Update Catalog
          </button>
          <button
            className={`tab-button ${activeTab === 'list-products' ? 'active' : ''}`}
            onClick={() => setActiveTab('list-products')}
            disabled={!activeCatalog}
          >
            List Products
          </button>
        </div>
      </div>
      <div className="catalog-content">{renderContent()}</div>
    </div>
  );
};

export default Catalog;