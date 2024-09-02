import React from 'react';
import ProductCard from './ProductCard';
import '../../assets/css/ProductMenu.css'; // Import CSS file

export type Additives = {
  name: string;
  price: number;
  icon: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  cost: number;
  price: number;
  dishType: 'main' | 'side' | 'beverage' | 'entry' | 'dessert';
  restaurant: string; // Assuming ObjectId is a string in TypeScript
  quantity: number;
  imageUrl?: string;
  isApproved?: boolean;
  user?: string; // Assuming ObjectId is a string in TypeScript
  soldQuantity: number;
  revenue?: number;
  createdAt?: Date;
  category: string; // Assuming ObjectId is a string in TypeScript
  likes: string[]; // Assuming ObjectId is a string in TypeScript
  additives: Additives[]; // Array of additives
  totalRevenue?: number;
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
