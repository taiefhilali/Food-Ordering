import React, { useState, useEffect } from 'react';
import '../../assets/css/ProductTable.css'; // Import your CSS file
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
  enabled: boolean;
  isApproved:boolean;
};

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:7000/api/my/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // const handleToggleEnable = (productId: string) => {
  //   const updatedProducts = products.map(product =>
  //     product._id === productId ? { ...product, enabled: !product.enabled } : product
  //   );
  //   setProducts(updatedProducts);
  //   // Here you would typically make an API call to update the product's enable status
  // };

  const handleToggleEnable = async (productId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.patch(
        `http://localhost:7000/api/my/products/${productId}/toggle-approval`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedProduct = response.data;
  
      const updatedProducts = products.map(product =>
        product._id === productId ? updatedProduct : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error toggling approval status:', error);
    }
  };
  
  const handleDelete = (productId: string) => {
    const updatedProducts = products.filter(product => product._id !== productId);
    setProducts(updatedProducts);
    // Here you would typically make an API call to delete the product
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Table" />
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Approved</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={product.isApproved}
                      onChange={() => handleToggleEnable(product._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button onClick={() => handleDelete(product._id)}>X</button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export default ProductTable;
