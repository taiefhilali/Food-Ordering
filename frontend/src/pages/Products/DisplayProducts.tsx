// // import React, { useState, useEffect } from 'react';
// // import ProductCard from '../../components/Products/ProductCard';
// // import DefaultLayout from '@/layouts/DefaultLayout';
// // import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// // import '../../assets/css/ProductMenu.css'; // Import your CSS file

// // type Product = {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   category: string;
// //   quantity: number;
// //   imageUrl: string;
// // };

// // const ProductDisplayPage: React.FC = () => {
// //   const [products, setProducts] = useState<Product[]>([]);

// //   useEffect(() => {
// //     fetch('http://localhost:7000/api/my/products')
// //       .then(response => response.json())
// //       .then(data => setProducts(data))
// //       .catch(error => console.error('Error fetching products:', error));
// //   }, []);

// //   const groupProductsByCategory = (products: Product[]) => {
// //     const groupedProducts: { [category: string]: Product[] } = {};
// //     products.forEach(product => {
// //       if (!groupedProducts[product.category]) {
// //         groupedProducts[product.category] = [];
// //       }
// //       groupedProducts[product.category].push(product);
// //     });
// //     return groupedProducts;
// //   };

// //   const renderProductCards = (groupedProducts: { [category: string]: Product[] }) => {
// //     return Object.keys(groupedProducts).map(category => (
// //       <div key={category} className="category-section">
// //         <h2 className="category-title">{category}</h2>
// //         <div className="product-grid">
// //           {groupedProducts[category].map(product => (
// //             <ProductCard key={product._id} product={product} />
// //           ))}
// //         </div>
// //       </div>
// //     ));
// //   };

// //   return (
// //     <DefaultLayout>
// //       <Breadcrumb pageName="Display Products" />
// //       <div className="product-display-page">
// //         {renderProductCards(groupProductsByCategory(products))}
// //       </div>
// //     </DefaultLayout>
// //   );
// // };

// // export default ProductDisplayPage;
// import React, { useState, useEffect } from 'react';
// import ProductCard from '../../components/Products/ProductCard';
// import DefaultLayout from '@/layouts/DefaultLayout';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import '../../assets/css/ProductMenu.css'; // Import your CSS file
// import axios from 'axios';

// type Product = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   quantity: number;
//   imageUrl: string;
// };

// const ProductDisplayPage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
  
//         useEffect(() => {const userId = localStorage.getItem('userId');
//         const token = localStorage.getItem('userToken');

//         if (!userId || !token) {
//           throw new Error('No userId or token found');
//         }
//           const fetchProducts = async () => {
//             try {
//               const response = await axios.get('http://localhost:7000/api/my/products/all', {
//                 params: { userId },
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               });
//               setProducts(response.data);
//             } catch (error) {
//               console.error('Error fetching products:', error);
//             }
//           };
      
//           fetchProducts();
//         }, []);

//   const groupProductsByCategory = (products: Product[]) => {
//     const groupedProducts: { [category: string]: Product[] } = {};
//     products.forEach(product => {
//       if (!groupedProducts[product.category]) {
//         groupedProducts[product.category] = [];
//       }
//       groupedProducts[product.category].push(product);
//     });
//     return groupedProducts;
//   };

//   const renderProductCards = (groupedProducts: { [category: string]: Product[] }) => {
//     return Object.keys(groupedProducts).map(category => (
//       <div key={category} className="category-section">
//         <h2 className="category-title">{category}</h2>
//         <div className="product-grid">
//           {groupedProducts[category].map(product => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Display Products" />
//       <div className="product-display-page">
//         {renderProductCards(groupProductsByCategory(products))}
//       </div>
//     </DefaultLayout>
//   );
// };

// export default ProductDisplayPage;
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
