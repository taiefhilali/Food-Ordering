import { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon from Material-UI
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

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

        console.log('userId:', userId); // Log userId for debugging
        console.log('token:', token);   // Log token for debugging

        const response = await axios.get('http://localhost:7000/api/my/restaurant', {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Request headers:', {
          Authorization: `Bearer ${token}`,
        }); // Log headers for debugging

        if (!response.data) {
          throw new Error("Failed to get restaurant");
        }

        const fetchedRestaurants: Restaurant[] = response.data;
        setRestaurants(fetchedRestaurants); // Set fetched restaurants into state

      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setError("Failed to fetch restaurant data. Please check the console for more details."); // Set detailed error message
      }
    };

    fetchRestaurants();
  }, []);

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
                Last Updated
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
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
                <p className="text-black dark:text-white">{restaurant.cuisines}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-10">{restaurant.lastUpdated}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <Link to={`/manage-restaurant/${restaurant._id}`}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />} // Use EditIcon without custom color
                    style={{ color: '#808080', backgroundColor: 'transparent' }} // Customize text color and remove background color
                  >
                    Update
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RestaurantTable;
