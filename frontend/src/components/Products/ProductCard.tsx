import React from 'react';
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
  
  return (
    <div className="box">
      <div className="quantity-corner">{product.quantity}</div> {/* Quantity corner */}
      <div className="box-img">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <h3 className="product-description">{product.description}</h3>
        <span className="product-price">${product.price}</span>
      </div>
      <i className="bx bx-cart-alt"></i>
    </div>
  );
};
export default ProductCard;
