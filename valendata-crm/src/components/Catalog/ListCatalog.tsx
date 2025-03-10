import React from 'react';


interface ListCatalogProps {
  catalogs: any[];
  activeCatalog: any;
  onSelectCatalog: (catalog: any) => void;
  onDeleteCatalog: (id: number) => void;
}

const ListCatalog: React.FC<ListCatalogProps> = ({
  catalogs,
  activeCatalog,
  onSelectCatalog,
  onDeleteCatalog,
}) => {
  return (
    <div className="catalog-list">
      <h3>Available Catalogs</h3>
      {catalogs.length === 0 ? (
        <p className="no-catalogs">No catalogs available. Create one to get started.</p>
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
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCatalog(catalog.id);
                  }}
                >
                  🗑️
                </button>
              </div>
              <p>{catalog.description}</p>
              <div className="catalog-card-footer">
                <span>{catalog.products?.length || 0} products</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCatalog;