import React from 'react';
import ProductCard from './ProductCard';
import '../../assets/css/ProductMenu.css'; // Import CSS file

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  dishType: string;
  quantity: number;
  imageUrl: string;
};

type ProductGridProps = {
  products: Product[];
};

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <section className="menu" id="menu">
      <div className="heading">
        <span>Menu</span>
        <h2>Tasty menu of the week</h2>
      </div>
      <div className="menu-container">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
