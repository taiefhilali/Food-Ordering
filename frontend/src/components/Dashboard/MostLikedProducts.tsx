import { Product } from '@/types'; // Assuming you have a Product type defined
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const MostLikedProducts = () => {
  const [, setProducts] = useState<Product[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: [], // Categories for product names
    },
    title: {
      text: 'Most Liked Products',
    },
    colors: ['#808080', '#808080'], // Custom colors (Gray)
  });
  const [chartSeries, setChartSeries] = useState<ApexAxisChartSeries>([]);

  useEffect(() => {
    // Fetch data for most liked products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/products/most-liked');
        const data: Product[] = response.data; // Axios stores response data in 'data'

        setProducts(data);

        // Prepare data for the chart
        const productNames = data.map((product) => 
          product.name.toUpperCase()
        ); // Convert product names to uppercase

        const likesCount = data.map((product) => product.likes.length); // Get the length of the 'likes' array

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            categories: productNames, // Product names for the x-axis
          },
        }));

        setChartSeries([
          {
            name: 'Likes',
            data: likesCount, // Number of likes for the y-axis
          },
        ]);
      } catch (error) {
        console.error('Error fetching most liked products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="most-liked-products">
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={450} width={450} />
    </div>
  );
};

export default MostLikedProducts;
