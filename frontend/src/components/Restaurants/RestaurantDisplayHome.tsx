import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types';
import './restauranthome.css'

const RestaurantDisplayHome = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('userToken');

                if (!userId || !token) {
                    throw new Error('No userId or token found');
                }

                const response = await axios.get('http://localhost:7000/api/my/restaurant/restaurants', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.data) {
                    throw new Error("Failed to get restaurants");
                }

                const fetchedRestaurants: Restaurant[] = response.data;
                setRestaurants(fetchedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setError("Failed to fetch restaurants data. Please check the console for more details.");
            }
        };

        fetchRestaurants();
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-full mx-auto mb-20">
        <h1 className="text-5xl font-bold tracking-tight flex justify-center items-center text-orange-500 opacity-75">
            ✨Check Our Restaurants Partnerships
        </h1>
        <div className="relative">
            <button
                className="scroll-arrow left-arrow"
                onClick={scrollLeft}
            >
                &#8249;
            </button>
            <div
                className="restaurant-scroll-container flex flex-row items-start gap-4.5 overflow-x-auto w-full mt-11 scrollbar-hide"
                ref={scrollContainerRef}
            >
                {restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="flex flex-col items-center w-1/4">
                        <div
                            className="w-50 h-50 rounded-full bg-gray-200 flex items-center justify-center"
                            style={{ backgroundImage: `url(${restaurant.imageUrl})`, backgroundSize: 'cover' }}
                        >
                            {/* Image or initial letter */}
                        </div>
                        <p className="mt-2 text-center">{restaurant.restaurantName}</p>
                    </div>
                ))}
            </div>
            <button
                className="scroll-arrow right-arrow"
                onClick={scrollRight}
            >
                &#8250;
            </button>
        </div>
    </div>
    );
};

export default RestaurantDisplayHome;
