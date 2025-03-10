import React, { useState } from 'react';
import './catalog.css';

interface CreateCatalogProps {
  onCatalogCreated: () => void;
}

const CreateCatalog: React.FC<CreateCatalogProps> = ({ onCatalogCreated }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [businessId, setBusinessId] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/catalogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          business_id: businessId, 
          access_token: accessToken 
        }),
      });
      if (!response.ok) throw new Error('Failed to create catalog');
      onCatalogCreated();
    } catch (error) {
      console.error('Error creating catalog:', error);
    }
  };

  return (
    <div className="create-catalog-form">
      <h3>Create New Catalog</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Catalog Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter catalog name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter catalog description"
            required
          />
        </div>
        <div className="form-group">
          <label>Business ID</label>
          <input
            type="text"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            placeholder="Enter business ID"
            required
          />
        </div>
        <div className="form-group">
          <label>Access Token</label>
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter access token"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Create Catalog
        </button>
      </form>
    </div>
  );
};

export default CreateCatalog;