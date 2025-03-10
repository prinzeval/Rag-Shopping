import React, { useState, useEffect } from 'react';
import CreateCatalog from './CreateCatalog';
import AddProduct from './AddProduct';
import ListCatalog from './ListCatalog';
import UpdateCatalog from './UpdateCatalog';
import UpdateCatalogProduct from './UpdateCatalogProduct';
import './catalog.css';

const Catalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [activeCatalog, setActiveCatalog] = useState<any>(null);
  const [catalogs, setCatalogs] = useState<any[]>([]);

  // Fetch catalogs from the backend
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch('/api/catalogs');
        const data = await response.json();
        setCatalogs(data.catalogs);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      }
    };

    fetchCatalogs();
  }, []);

  // Handle catalog selection
  const handleSelectCatalog = (catalog: any) => {
    setActiveCatalog(catalog);
  };

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateCatalog onCatalogCreated={() => setActiveTab('list')} />;
      case 'add-product':
        return activeCatalog ? (
          <AddProduct catalogId={activeCatalog.id} onProductAdded={() => setActiveTab('list')} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      case 'update-catalog':
        return activeCatalog ? (
          <UpdateCatalog catalog={activeCatalog} onCatalogUpdated={() => setActiveTab('list')} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      case 'update-product':
        return activeCatalog ? (
          <UpdateCatalogProduct catalogId={activeCatalog.id} onProductUpdated={() => setActiveTab('list')} />
        ) : (
          <p>Please select a catalog first.</p>
        );
      default:
        return (
          <ListCatalog
            catalogs={catalogs}
            activeCatalog={activeCatalog}
            onSelectCatalog={handleSelectCatalog}
            onDeleteCatalog={(id) => setCatalogs(catalogs.filter((cat) => cat.id !== id))}
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
            onClick={() => setActiveTab('list')}
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
          >
            Add Product
          </button>
          <button
            className={`tab-button ${activeTab === 'update-catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('update-catalog')}
          >
            Update Catalog
          </button>
          <button
            className={`tab-button ${activeTab === 'update-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('update-product')}
          >
            Update Product
          </button>
        </div>
      </div>
      <div className="catalog-content">{renderContent()}</div>
    </div>
  );
};

export default Catalog;