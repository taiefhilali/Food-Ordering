import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Product } from '@/types/product';
import { ApexOptions } from 'apexcharts';


const TopProductsChart = () => {
    const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/products/quantity');
        setTopProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProducts();
  }, []);

  const productNames = topProducts.map((product) => product.name);
  const productQuantities = topProducts.map((product) => product.quantity);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: productNames,
    },
  };

  const series = [
    {
      name: 'Quantity',
      data: productQuantities,
    },
  ];

  return (
    <div>
      <h2>Most Added Products</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default TopProductsChart;