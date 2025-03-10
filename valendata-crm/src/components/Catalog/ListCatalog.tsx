import React, { useState } from 'react';

interface ListCatalogProps {
  catalogs: any[];
  activeCatalog: any;
  onSelectCatalog: (catalog: any) => void;
  onDeleteCatalog: (id: string) => void;
  error: string | null;
}

const ListCatalog: React.FC<ListCatalogProps> = ({
  catalogs,
  activeCatalog,
  onSelectCatalog,
  onDeleteCatalog,
  error,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId) {
      await onDeleteCatalog(deletingId);
      setConfirmDelete(false);
      setDeletingId(null);
    }
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
    setDeletingId(null);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-list">
      <h3>Available Catalogs</h3>
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
                    >
                      ✓
                    </button>
                    <button
                      className="confirm-no"
                      onClick={handleCancelDelete}
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