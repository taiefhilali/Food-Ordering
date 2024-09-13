/* eslint-disable @typescript-eslint/no-unused-vars */
import { Restaurant } from '@/types';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const MostRatedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: [],
    },
    title: {
      text: 'Most Rated Restaurants',
    },
    colors: ['#FFA500', '#808080'], // Orange and Gray colors
  });
  const [chartSeries, setChartSeries] = useState<ApexAxisChartSeries>([]);

  useEffect(() => {
    // Fetch data for most rated restaurants
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/restaurant/most-rated');
        const data: Restaurant[] = response.data; // Axios stores response data in 'data'
        setRestaurants(data);

        // Prepare data for the chart
        const restaurantNames = data.map((restaurant) => restaurant.restaurantName);
        const ratings = data.map((restaurant) => restaurant.rating);

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            categories: restaurantNames, // Restaurant names for the x-axis
          },
        }));

        setChartSeries([
          {
            name: 'Rating',
            data: ratings, // Ratings for the y-axis
          },
        ]);
      } catch (error) {
        console.error('Error fetching most rated restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="most-rated-restaurants">
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} width={350} />
    </div>
  );
};

export default MostRatedRestaurants;
