import React from 'react';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string; // Add imageUrl field to the Product type
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px', width: '200px', height: '200px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transformOrigin: 'center center', position: 'absolute', top: 0, left: 0 }}>
        <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, background: 'rgba(255, 255, 255, 0.8)', width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <p>Quantity: {product.quantity}</p>
      </div>
    </div>
  );
};

export default ProductCard;
