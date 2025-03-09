// src/components/Catalog/Catalog.tsx
import React, { useState, useEffect } from 'react';
import './catalog.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

interface Catalog {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

const Catalog: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [activeCatalog, setActiveCatalog] = useState<Catalog | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  
  // Form states
  const [catalogForm, setCatalogForm] = useState<{ name: string; description: string }>({
    name: '',
    description: ''
  });
  
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: ''
  });

  // Mock data for demo purposes
  useEffect(() => {
    const mockCatalogs: Catalog[] = [
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic products and gadgets',
        products: [
          { id: '101', name: 'Smartphone', description: 'Latest model', price: 999 },
          { id: '102', name: 'Laptop', description: 'Business laptop', price: 1299 }
        ]
      },
      {
        id: '2',
        name: 'Home Goods',
        description: 'Products for your home',
        products: [
          { id: '201', name: 'Coffee Maker', description: 'Automatic coffee maker', price: 89 },
          { id: '202', name: 'Toaster', description: '4-slot toaster', price: 49 }
        ]
      }
    ];
    
    setCatalogs(mockCatalogs);
  }, []);

  const handleCreateCatalog = () => {
    const newCatalog: Catalog = {
      id: Date.now().toString(),
      name: catalogForm.name,
      description: catalogForm.description,
      products: []
    };
    
    setCatalogs([...catalogs, newCatalog]);
    setCatalogForm({ name: '', description: '' });
    setActiveTab('list');
  };

  const handleAddProduct = () => {
    if (!activeCatalog) return;
    
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productForm
    };
    
    const updatedCatalog = {
      ...activeCatalog,
      products: [...activeCatalog.products, newProduct]
    };
    
    setCatalogs(catalogs.map(cat => 
      cat.id === updatedCatalog.id ? updatedCatalog : cat
    ));
    
    setActiveCatalog(updatedCatalog);
    setProductForm({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: ''
    });
  };

  const handleDeleteCatalog = (id: string) => {
    setCatalogs(catalogs.filter(catalog => catalog.id !== id));
    if (activeCatalog?.id === id) {
      setActiveCatalog(null);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!activeCatalog) return;
    
    const updatedProducts = activeCatalog.products.filter(product => product.id !== productId);
    const updatedCatalog = { ...activeCatalog, products: updatedProducts };
    
    setCatalogs(catalogs.map(cat => 
      cat.id === updatedCatalog.id ? updatedCatalog : cat
    ));
    
    setActiveCatalog(updatedCatalog);
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
            className={`tab-button ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => {
              if (activeCatalog) setActiveTab('product');
              else alert('Please select a catalog first');
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="catalog-content">
        {activeTab === 'list' && (
          <div className="catalog-list">
            <h3>Available Catalogs</h3>
            {catalogs.length === 0 ? (
              <p className="no-catalogs">No catalogs available. Create one to get started.</p>
            ) : (
              <div className="catalogs-grid">
                {catalogs.map(catalog => (
                  <div 
                    key={catalog.id} 
                    className={`catalog-card ${activeCatalog?.id === catalog.id ? 'active' : ''}`}
                    onClick={() => setActiveCatalog(catalog)}
                  >
                    <div className="catalog-card-header">
                      <h4>{catalog.name}</h4>
                      <button 
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCatalog(catalog.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    <p>{catalog.description}</p>
                    <div className="catalog-card-footer">
                      <span>{catalog.products.length} products</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCatalog && (
              <div className="products-section">
                <h3>Products in {activeCatalog.name}</h3>
                {activeCatalog.products.length === 0 ? (
                  <p className="no-products">No products in this catalog. Add some products.</p>
                ) : (
                  <div className="products-table-container">
                    <table className="products-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCatalog.products.map(product => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                              <button 
                                className="action-button edit"
                                onClick={() => console.log('Edit product', product.id)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="action-button delete"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-catalog-form">
            <h3>Create New Catalog</h3>
            <div className="form-group">
              <label>Catalog Name</label>
              <input 
                type="text" 
                value={catalogForm.name} 
                onChange={(e) => setCatalogForm({...catalogForm, name: e.target.value})}
                placeholder="Enter catalog name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={catalogForm.description} 
                onChange={(e) => setCatalogForm({...catalogForm, description: e.target.value})}
                placeholder="Enter catalog description"
              />
            </div>
            <button 
              className="form-button"
              onClick={handleCreateCatalog}
              disabled={!catalogForm.name}
            >
              Create Catalog
            </button>
          </div>
        )}

        {activeTab === 'product' && activeCatalog && (
          <div className="add-product-form">
            <h3>Add Product to {activeCatalog.name}</h3>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                value={productForm.name} 
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={productForm.description} 
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Enter product description"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input 
                type="number" 
                value={productForm.price} 
                onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                placeholder="Enter product price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input 
                type="text" 
                value={productForm.imageUrl} 
                onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            <div className="form-group">
              <label>Category (optional)</label>
              <input 
                type="text" 
                value={productForm.category} 
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                placeholder="Enter product category"
              />
            </div>
            <button 
              className="form-button"
              onClick={handleAddProduct}
              disabled={!productForm.name || productForm.price <= 0}
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;