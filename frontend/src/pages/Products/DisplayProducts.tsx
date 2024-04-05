import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/Products/ProductCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    imageUrl: string; // Add imageUrl field to the Product type

  };
const ProductDisplayPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:7000/api/my/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const groupProductsByCategory = (products: Product[]) => {
    const groupedProducts: { [category: string]: Product[] } = {};
    products.forEach(product => {
      if (!groupedProducts[product.category]) {
        groupedProducts[product.category] = [];
      }
      groupedProducts[product.category].push(product);
    });
    return groupedProducts;
  };

  const renderProductCards = (groupedProducts: { [category: string]: Product[] }) => {
    return Object.keys(groupedProducts).map(category => (
      <div key={category}>
        <h2>{category}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {groupedProducts[category].map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <DefaultLayout>
    <div>
    <Breadcrumb pageName="Display Products" />

      {renderProductCards(groupProductsByCategory(products))}
    </div> </DefaultLayout>
  );
};

export default ProductDisplayPage;
