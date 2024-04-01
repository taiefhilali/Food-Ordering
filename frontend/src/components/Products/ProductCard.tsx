import React, { useState } from 'react';
import '../../assets/css/ProductMenu.css'; // Import CSS file

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`product-card ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick}>
    <div className="image-container">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
    </div>
    <div className="details-container">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price" style={{ color: 'green' }}>Price: ${product.price}</p>
      <p className="product-category">Category: {product.category}</p>
      <p className="product-quantity">Quantity: {product.quantity}</p>
    </div>
  </div>
);
};

export default ProductCard;
