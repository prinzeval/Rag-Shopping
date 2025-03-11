import React, { useState } from 'react';
import './listcatalog.css';


interface ListCatalogProps {
  catalogs: any[];
  activeCatalog: any;
  onSelectCatalog: (catalog: any) => void;
  onDeleteCatalog: (id: string) => void;
}

const ListCatalog: React.FC<ListCatalogProps> = ({
  catalogs,
  activeCatalog,
  onSelectCatalog,
  onDeleteCatalog,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // API base URL - must match your FastAPI server
  const API_BASE_URL = 'http://localhost:8000/api';
  
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId) {
      setLoading(true);
      setError(null);
      
      try {
        const url = `${API_BASE_URL}/catalogs/${deletingId}/delete`;
        console.log(`Deleting catalog at: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        // Get the response text
        const responseText = await response.text();
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${responseText}`);
        }
        
        console.log('Catalog deleted successfully');
        onDeleteCatalog(deletingId);
      } catch (error) {
        console.error('Error deleting catalog:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setConfirmDelete(false);
        setDeletingId(null);
      }
    }
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
    setDeletingId(null);
  };

  return (
    <div className="catalog-list">
      <h3>Available Catalogs</h3>
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button 
            className="retry-button"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      {catalogs.length === 0 ? (
        <div className="no-catalogs">
          <p>No catalogs available. Create one to get started.</p>
          <div className="empty-state-icon">📋</div>
        </div>
      ) : (
        <div className="catalogs-grid">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className={`catalog-card ${activeCatalog?.id === catalog.id ? 'active' : ''}`}
              onClick={() => onSelectCatalog(catalog)}
            >
              <div className="catalog-card-header">
                <h4>{catalog.name}</h4>
                {confirmDelete && deletingId === catalog.id ? (
                  <div className="delete-confirm">
                    <button
                      className="confirm-yes"
                      onClick={handleConfirmDelete}
                      disabled={loading}
                    >
                      {loading ? "..." : "✓"}
                    </button>
                    <button
                      className="confirm-no"
                      onClick={handleCancelDelete}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    className="delete-button"
                    onClick={(e) => handleDeleteClick(e, catalog.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="catalog-description">
                {catalog.description || 'No description available'}
              </p>
              <div className="catalog-card-footer">
                <span>ID: {catalog.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCatalog;