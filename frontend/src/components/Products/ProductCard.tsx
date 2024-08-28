
import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/ProductMenu.css';
import HTMLContent from '../../components/HTMLContent'; // Adjust the import path accordingly

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
    <div className="product-card">

      <div className="bg-white border border-whiter transition transform duration-700 hover:shadow-xl hover:scale-105 p-4 rounded-lg relative">
        <span className="bg-white-100 border border-orange-400 rounded-full text-orange-500 text-sm poppins px-4 py-1 inline-block mb-4 ">{product.quantity} </span>
        <Link to={`/product/${product._id}`}>
          <div className="relative" style={{ paddingTop: '66.36%' }}>
            <img
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
        </Link>

        <div className="flex flex-col items-center my-3 space-y-2">
          <h1 className="text-gray-900 poppins text-lg">{product.name}</h1>
          <p className="text-gray-500 poppins text-sm text-center">         <HTMLContent content={product.description.slice(0, 120)} />
          </p>
          <h2 className="text-gray-900 poppins text-2xl font-bold">{product.price} dt</h2>
          <button className="bg-orange-500 text-white px-8 py-2 focus:outline-none poppins rounded-full mt-24 transform transition duration-300 hover:scale-105">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

