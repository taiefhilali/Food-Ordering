import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/Products/ProductCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import '../../assets/css/ProductMenu.css'; // Import your CSS file
import axios from 'axios';
import Skeleton from '../../components/Products/Skeleton'; // Import Skeleton component

export type Additives = {
  name: string;
  price: number;
  icon: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string; // Optional
  cost?: number; // Optional
  price: number;
  dishType?: 'main' | 'side' | 'beverage' | 'entry' | 'dessert'; // Optional
  restaurant?: string; // Optional
  quantity: number;
  imageUrl?: string; // Optional
  isApproved?: boolean; // Optional
  user?: string; // Optional
  soldQuantity?: number; // Optional
  revenue?: number; // Optional
  createdAt?: Date; // Optional
  category: string;
  likes: string[];
  additives: Additives[];
  totalRevenue?: number; // Optional
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
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Default to epoch if undefined
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0); // Default to epoch if undefined
        return dateB.getTime() - dateA.getTime();
      });

      // Filter products to include only those that are approved
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const approvedProducts = sortedProducts.filter((product: { isApproved: any; }) => product.isApproved);

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
