import React, { useState } from 'react';

interface UpdateCatalogProps {
  catalog: any;
  onCatalogUpdated: () => void;
}

const UpdateCatalog: React.FC<UpdateCatalogProps> = ({ catalog, onCatalogUpdated }) => {
  const [name, setName] = useState<string>(catalog.name);
  const [description, setDescription] = useState<string>(catalog.description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/catalogs/${catalog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error('Failed to update catalog');
      onCatalogUpdated();
    } catch (error) {
      console.error('Error updating catalog:', error);
    }
  };

  return (
    <div className="update-catalog-form">
      <h3>Update Catalog</h3>
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
        <button type="submit" className="form-button">
          Update Catalog
        </button>
      </form>
    </div>
  );
};

export default UpdateCatalog;