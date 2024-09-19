import React, { useEffect, useState } from 'react';
import './statistics.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import ApexChart from '../Products/RevenueByDateComponent';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  averageDifference: number;
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

  const [pieChartData, setPieChartData] = useState({
    labels: [] as string[],
    datasets: [{
      label: 'Revenue by Category',
      data: [] as number[],
      backgroundColor: ['#f5893d', '#D3D3D3', '#FF8C00', '#A9A9A9', '#FF6347'],
    }],
  });

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Satoshi', // Font family
            weight: 'bold' as const, // Font weight
            size: 14, // Font size
          },
        },
      },
      tooltip: {
        // Tooltip configuration if needed
      },
    },
  };

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

    const fetchPieChartData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/products/revenue-by-category'); // Update endpoint as needed
        const { categories, revenue } = response.data; // Example structure
        setPieChartData({
          labels: categories,
          datasets: [{
            label: 'Revenue by Category',
            data: revenue,
            backgroundColor: ['#f5893d', '#D3D3D3', '#FF8C00', '#A9A9A9', '#FF6347'],
          }],
        });
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchRestaurantCount();
    fetchProductCount();
    fetchCategoryCount();
    fetchPriceCostStats();
    fetchPieChartData();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Dashboard Vendor' />
      <div className="container">
        <div className="card-row">
          <CardCounter icon="fa-utensils" count={restaurantCount} label="Restaurants" color="primary" />
          <CardCounter icon="fa-bowl-food" count={productCount} label="Food Items" color="danger" />
          <CardCounter icon="fa-list" count={categoryCount} label="Categories" color="success" />
          <CardCounter icon="fa-dollar-sign" count={priceCostStats.totalDifference} label="Total Profit" color="warning" />
          <CardCounter icon="fa-calculator" count={Math.round(priceCostStats.averageDifference)} label="Avg Profit per Item" color="info" />
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-left">
          <ApexChart />
        </div>
        <div className="chart-right">
          <h3>Revenue by Category</h3>
          <div className="pie-chart-wrapper">
            <Pie data={pieChartData} options={pieChartOptions}  />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
