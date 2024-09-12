import { Restaurant } from '@/types';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const MostRatedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    // Fetch data for most rated restaurants
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/restaurants/most-rated');
        const data = await response.json();
        setRestaurants(data);

        // Prepare data for the chart
        const restaurantNames = data.map((restaurant) => restaurant.name);
        const ratings = data.map((restaurant) => restaurant.rating);

        setChartOptions({
          chart: {
            type: 'bar',
          },
          xaxis: {
            categories: restaurantNames, // Restaurant names for the x-axis
          },
          title: {
            text: 'Most Rated Restaurants',
          },
        });

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
      <h2>Most Rated Restaurants</h2>
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
};

export default MostRatedRestaurants;
