import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
      <Link to={`/product/${product._id}`} className="box-img"> {/* Wrap image with Link */}
        <img src={product.imageUrl} alt={product.name} />
      </Link>
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
