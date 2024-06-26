import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';
import './statistics.css'; // Assuming you save the CSS in this file
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import ApexChart from '../Products/RevenueByDateComponent';
import axios from 'axios';

const CardCounter: React.FC<{ icon: string, count: number, label: string, color: string }> = ({ icon, count, label, color }) => (
    <div className="card-counter-wrapper">
        <div className={`card-counter ${color}`}>
            <i className={`fa ${icon}`}></i>
            <span className="count-numbers">{count}</span>
            <span className="count-name">{label}</span>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [restaurantCount, setRestaurantCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        const fetchRestaurantCount = async () => {
          try { const token = localStorage.getItem('userToken');
          if (!token) {
              throw new Error('No token found');
          }
          const userId = localStorage.getItem('userId') 
            const response = await axios.get('http://localhost:7000/api/my/restaurant/allmyrestaurants', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Adjust the URL as needed
            setRestaurantCount(response.data.length);
          } catch (error) {
            console.error('Error fetching restaurants:', error);
          }
        };
        const fetchProductCount = async () => {
            try {const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            const userId = localStorage.getItem('userId') 
              const response = await axios.get('http://localhost:7000/api/my/products/all', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,   
                },
            });
              setProductCount(response.data.length);
            } catch (error) {
              console.error('Error fetching products:', error);
            }
          };
          const fetchCategoryCount = async () => {
            try {
              const response = await axios.get('http://localhost:7000/api/my/categories'); // Adjust the URL as needed
              setCategoryCount(response.data.length);
            } catch (error) {
              console.error('Error fetching categories:', error);
            }
          };
        fetchRestaurantCount();
        fetchProductCount();
        fetchCategoryCount();


      }, []);
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Dashboard Vendor'/>
        <div className="container">
            <div className="card-row">
                <CardCounter icon="fa-utensils" count={restaurantCount} label="Restaurants" color="primary" />
                <CardCounter icon="fa-bowl-food" count={productCount} label="Food Items" color="danger" />
                <CardCounter icon="fa-list" count={categoryCount} label="Categories" color="success" />
                <CardCounter icon="fa-cart-shopping" count={35} label="Users" color="info" />
                {/* <CardCounter icon="fa-users" count={35} label="Users" color="info" /> */}

            </div>
        </div>
        <ApexChart></ApexChart>
        </DefaultLayout>
    );
};

export default Dashboard;
