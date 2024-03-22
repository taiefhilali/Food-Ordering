import { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to have axios installed
import { Restaurant } from '@/types';
import { useClerk } from '@clerk/clerk-react';

const displayrestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { user } = useClerk();

  const getUserIdFromSession = () => {
    // Implement this function to retrieve the user ID from the session
    // For example, if you are using localStorage:
    return localStorage.getItem("userInfo");
  };
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const userId = user.id;
        console.log(userId)

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URLVITE_API_BASE_URL}/api/my/restaurant`, {
          params: { userId }
        });

        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, [user]);


 

return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Restaurant Details
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Source
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Visitors
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Revenues
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Sales
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Conversion
            </h5>
          </div>
        </div>

        {restaurants.map((restaurant, key) => (
    <div
      className={`grid grid-cols-3 sm:grid-cols-5 ${
        key === restaurants.length - 1
          ? ''
          : 'border-b border-stroke dark:border-strokedark'
      }`}
      key={key}
    >
      <div className="flex items-center gap-3 p-2.5 xl:p-5">
        {/* Render restaurant logo */}
        <div className="flex-shrink-0">
          <img src={restaurant.imageUrl} alt="Restaurant" />
        </div>
        {/* Render restaurant name */}
        <p className="hidden text-black dark:text-white sm:block">
          {restaurant.restaurantName}
        </p>
      </div>

      {/* Render other restaurant data */}
      {/* Adjust the following columns based on your restaurant data */}
      {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-black dark:text-white">{restaurant.visitors}K</p>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-meta-3">${restaurant.revenues}</p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-black dark:text-white">{restaurant.sales}</p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-meta-5">{restaurant.conversion}%</p>
      </div> */}
    </div>
  ))}
      </div>
    </div>
  );
};

export default displayrestaurants;

