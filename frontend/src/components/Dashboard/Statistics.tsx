import React, { useEffect, useState } from 'react';
import './statistics.css';
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
interface PriceCostStats {
  totalPrice: number;
  totalCost: number;
  totalDifference: number;
  productCount: number;
  averageDifference: number; // Add this line
}

const Dashboard: React.FC = () => {
    const [restaurantCount, setRestaurantCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [priceCostStats, setPriceCostStats] = useState<PriceCostStats>({
        totalPrice: 0,
        totalCost: 0,
        totalDifference: 0,
        productCount: 0,
        averageDifference: 0,
    });
console.log('========priceCostStats============================');
console.log(priceCostStats);
console.log('====================================');
    useEffect(() => {
        const fetchRestaurantCount = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    throw new Error('No token found');
                }
                const userId = localStorage.getItem('userId');
                const response = await axios.get('http://localhost:7000/api/my/restaurant/allmyrestaurants', {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRestaurantCount(response.data.length);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        const fetchProductCount = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    throw new Error('No token found');
                }
                const userId = localStorage.getItem('userId');
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
                const response = await axios.get('http://localhost:7000/api/my/categories');
                setCategoryCount(response.data.length);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchPriceCostStats = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/my/products/stats/price-cost-difference');
                setPriceCostStats(response.data);
            } catch (error) {
                console.error('Error fetching price-cost statistics:', error);
            }
        };

        fetchRestaurantCount();
        fetchProductCount();
        fetchCategoryCount();
        fetchPriceCostStats();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Dashboard Vendor'/>
            <div className="container">
                <div className="card-row">
                    <CardCounter icon="fa-utensils" count={restaurantCount} label="Restaurants" color="primary" />
                    <CardCounter icon="fa-bowl-food" count={productCount} label="Food Items" color="danger" />
                    <CardCounter icon="fa-list" count={categoryCount} label="Categories" color="success" />
                    <CardCounter icon="fa-dollar-sign" count={priceCostStats.totalDifference}  label=" Total Profit(dt)" color="warning" />
                    <CardCounter icon="fa-calculator" count={Math.round(priceCostStats.averageDifference)} label="Avg Profit per Item(dt) " color="info" />
                </div>
            </div>
            <ApexChart />
        </DefaultLayout>
    );
};

export default Dashboard;
