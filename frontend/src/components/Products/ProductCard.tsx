// import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom
// import '../../assets/css/ProductMenu.css'; // Import CSS file

// type Product = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   quantity: number;
//   imageUrl: string;
// };

// type ProductCardProps = {
//   product: Product;
// };

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

//   return (
//     <div className="box">
//       <div className="quantity-corner">{product.quantity}</div> {/* Quantity corner */}
//       <Link to={`/product/${product._id}`} className="box-img"> {/* Wrap image with Link */}
//         <img src={product.imageUrl} alt={product.name} />
//       </Link>
//       <div className="product-info">
//         <h2 className="product-name">{product.name}</h2>
//         <h3 className="product-description">{product.description}</h3>
//         <span className="product-price">${product.price}</span>
//       </div>
//       <i className="bx bx-cart-alt"></i>
//     </div>
//   );
// };
// export default ProductCard;
import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/ProductMenu.css';

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

      <div className="bg-white border border-slate-400 transition transform duration-700 hover:shadow-xl hover:scale-105 p-4 rounded-lg relative">
        <span className="bg-white-100 border border-slate-400 rounded-full text-orange-500 text-sm poppins px-4 py-1 inline-block mb-4 ">{product.quantity} </span>
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
          <p className="text-gray-500 poppins text-sm text-center">{product.description.slice(0, 50)}</p>
          <h2 className="text-gray-900 poppins text-2xl font-bold">{product.price} dt</h2>
          <button className="bg-orange-500 text-white px-8 py-2 focus:outline-none poppins rounded-full mt-24 transform transition duration-300 hover:scale-105">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

