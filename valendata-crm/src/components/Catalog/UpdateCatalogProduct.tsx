import React, { useState } from 'react';

interface UpdateCatalogProductProps {
  catalogId: number;
  onProductUpdated: () => void;
}

const UpdateCatalogProduct: React.FC<UpdateCatalogProductProps> = ({ catalogId, onProductUpdated }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    brand: '',
    google_product_category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/catalogs/${catalogId}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to update product');
      onProductUpdated();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="update-product-form">
      <h3>Update Product</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Enter product description"
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            placeholder="Enter product price"
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={product.imageUrl}
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            placeholder="Enter brand"
          />
        </div>
        <div className="form-group">
          <label>Google Product Category</label>
          <input
            type="text"
            value={product.google_product_category}
            onChange={(e) => setProduct({ ...product, google_product_category: e.target.value })}
            placeholder="Enter Google product category"
          />
        </div>
        <button type="submit" className="form-button">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateCatalogProduct;