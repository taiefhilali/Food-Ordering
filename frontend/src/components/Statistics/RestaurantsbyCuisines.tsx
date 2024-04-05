import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Restaurant } from '@/types';
import getUserIdFromSession from '../Authentication/getUserIdFromSession';
import { ApexOptions } from "apexcharts";

const CuisinebyRestaurant = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getUserIdFromSession();

                if (!userId) {
                    console.error("User is not authenticated");
                    return;
                }

                const response = await axios.get('http://localhost:7000/api/my/restaurant', {
                    params: { userId }
                });

                if (!response.data) {
                    throw new Error("Failed to get restaurant");
                }

                const fetchedRestaurants: Restaurant[] = response.data;
                setRestaurants(fetchedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };

        fetchData();
    }, []);

    const calculateFamousCuisinePercentages = (restaurants: Restaurant[]) => {
        const cuisineCounts: { [key: string]: number } = {};
    
        // Count occurrences of each cuisine for each restaurant
        restaurants.forEach((restaurant) => {
            restaurant.cuisines.forEach((cuisine: string) => {
                cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
            });
        });
    
        // Sort cuisines based on the count of restaurants offering them in descending order
        const sortedCuisines = Object.keys(cuisineCounts).sort((a, b) => cuisineCounts[b] - cuisineCounts[a]);
    
        // Get the count of restaurants offering the most famous cuisine
        const maxCount = cuisineCounts[sortedCuisines[0]];
    
        // Filter cuisines that have the same count as the most famous cuisine
        const mostFamousCuisines = sortedCuisines.filter((cuisine) => cuisineCounts[cuisine] === maxCount);
    
        // Calculate percentage for each most famous cuisine
        const percentages: number[] = mostFamousCuisines.map((cuisine) => {
            return parseFloat(((cuisineCounts[cuisine] / restaurants.length) * 100).toFixed(2));
        });
    
        // Return an array containing the percentages of the most famous cuisines
        return percentages;
    };
    
    const options: ApexOptions = {
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            type: 'donut',
        },
        colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
        labels: Object.keys(calculateFamousCuisinePercentages(restaurants)).map((key) => `Cuisine ${key}`),
        legend: {
            show: false,
            position: 'bottom',
        },
      
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    background: 'transparent',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        responsive: [
            {
                breakpoint: 2600,
                options: {
                    chart: {
                        width: 380,
                    },
                },
            },
            {
                breakpoint: 640,
                options: {
                    chart: {
                        width: 200,
                    },
                },
            },
        ],
    };
    
    
      

    return (
        <div className="your-container-class">
            <ReactApexChart options={options} series={calculateFamousCuisinePercentages(restaurants)}  type="donut" />
        </div>
    );
};

export default CuisinebyRestaurant;
