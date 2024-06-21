import { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { Utensils } from 'lucide-react';
const RestaurantTable = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null); // Specify the type for error state

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

    const toggleApproval = async (id: string) => {
        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.patch(`http://localhost:7000/api/my/restaurant/${id}/toggle-approval`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data) {
                throw new Error("Failed to toggle approval status");
            }

            // Update restaurants state after toggle
            const updatedRestaurants = restaurants.map((restaurant) =>
                restaurant._id === id ? { ...restaurant, isApproved: !restaurant.isApproved } : restaurant
            );
            setRestaurants(updatedRestaurants);
        } catch (error) {
            console.error("Error toggling approval status:", error);
            setError("Failed to toggle approval status. Please check the console for more details.");
        }
    };


    const handleDelete = async (restaurantId: string) => {
        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('No token found');
            }

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f2ab48',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:7000/api/restaurant/${restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedRestaurants = restaurants.filter(restaurant => restaurant._id !== restaurantId);
                setRestaurants(updatedRestaurants);

                Swal.fire(
                    'Deleted!',
                    'Your restaurant has been deleted.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire('Error!', 'There was an error deleting your restaurant.', 'error');
        }
    };



    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Display Restaurants" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Restaurant Details
                </h4>
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Name
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Cuisines
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                rating              </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Approving
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Remove
                            </h5>
                        </div>
                    </div>

                    {restaurants.map((restaurant, index) => (
                        <div
                            key={restaurant._id}
                            className={`grid grid-cols-3 sm:grid-cols-5 ${index === restaurants.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                                }`}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <div className="flex-shrink-0">
                                    <img
                                        src={restaurant.imageUrl}
                                        alt="Restaurant"
                                        className="w-14 h-14 rounded-full border-2 border-gray-300"
                                    />
                                </div>
                                <p className="text-black dark:text-white sm:block">
                                    {restaurant.restaurantName}
                                </p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <div className="text-black dark:text-white">
                                    {restaurant.cuisines.map((cuisine, i) => (
                                        <div key={i} className="flex items-center text-sm">
                                            {/* <Utensils className="mr-2 text-slate-400 text-xs" /> */}
                                            <span>{cuisine}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <p className="text-meta-10">{restaurant.ratingCount}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={restaurant.isApproved}
                                        onChange={() => toggleApproval(restaurant._id)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleApproval(restaurant._id)}
                  style={{
                    backgroundColor: restaurant.isApproved ? 'rgba(0, 128, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)',
                    color: 'white',
                    minWidth: '30px',
                    height: '3 0px',
                    borderRadius: '20%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                > 
                  {restaurant.isApproved ? <CheckCircleIcon /> : <CancelIcon />}
                </Button>*/}
                                <Link to={`/manage-restaurant/${restaurant._id}`}>

                                </Link>
                            </div>
                            <div className="flex items-center justify-center p-2.5 sm:flex xl:p-5">

                                <button onClick={() => handleDelete(restaurant._id)}>X</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
};


export default RestaurantTable;
