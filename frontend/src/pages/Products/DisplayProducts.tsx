
import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/Products/ProductCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import '../../assets/css/ProductMenu.css'; // Import your CSS file
import axios from 'axios';
import Skeleton from '../../components/Products/Skeleton'; // Import Skeleton component

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
};

const ProductDisplayPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  // const [menuTab, setMenuTab] = useState<string>('Electronics');
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');
  
    if (!userId || !token) {
      throw new Error('No userId or token found');
    }
  
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:7000/api/my/products/all', {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Sort products by createdAt timestamp in descending order (newest first)
        const sortedProducts = response.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
  
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  // const handleMenuTabs = (category: string) => {
  //   setMenuTab(category);
  // };

  const renderProductCards = (products: Product[]) => {
    return products.map(product => (
      loading ? <Skeleton key={product._id} /> : <ProductCard key={product._id} product={product} />
    ));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Display Products" />
      <section className="my-12 max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {renderProductCards(products)}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ProductDisplayPage;
