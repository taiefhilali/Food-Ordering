

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';


const ApexChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const response = await axios.get(`http://localhost:7000/api/my/products/revenue/${today}`);
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const chartData = {
    series: [{
      name: "Total Revenue in",
      data: revenueData.map(data => data.totalRevenue)
    }],
    options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          colors: ['#F98641'], // Set the line color here
        },
        title: {
          text: 'Product Revenue Trends (dt)',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          type: '', // Ensure correct type for date formatting
          categories: revenueData.map(data => new Date(data.date).getTime()),
          labels: {
            formatter: function(val) {
              return new Date(val).toLocaleDateString('en-US'); // Adjust locale as needed
            }
          }
        }
      }
      
  };
  

  return (
      <div>
        <div id="chart">
          <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
      </div>
  );
};

export default ApexChart;


