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
  isApproved: boolean;
  createdAt: string; // Ensure you have createdAt field for sorting
};

const ProductDisplayPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (!userId || !token) {
      console.error('No userId or token found');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:7000/api/my/products/all', {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort products by createdAt timestamp in descending order (newest first)
      const sortedProducts = response.data.sort((a: Product, b: Product) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // Filter products to include only those that are approved
      const approvedProducts = sortedProducts.filter(product => product.isApproved);

      setProducts(approvedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products initially

    const intervalId = setInterval(() => {
      fetchProducts(); // Fetch products every 5 seconds
    }, 5000);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once on mount

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
