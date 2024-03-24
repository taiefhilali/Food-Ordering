// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Restaurant } from '@/types';
// import { useClerk } from '@clerk/clerk-react';
// import {useGetMyRestaurant} from '../../api/MyRestaurantApi'
// const API_BASE_URL = import.meta.env.API_BASE_URL;


// const fetchRestaurants = async (user: Restaurant) => {
//   try {
//     const response = await axios.get('/api/my/restaurant', {
//       params: { user }
//     });
//     console.log('rkrkrk',response)
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching restaurants:', error);
//     throw error;
//   }
// };
// const getUserIdFromSession = () => {
//   // Implement this function to retrieve the user ID from the session
//   // For example, if you are using localStorage:
//   const userInfo = localStorage.getItem("userInfo");
//   if (userInfo) {
//     const userObj = JSON.parse(userInfo);
//     return userObj._id;
//   }
//   return null;
// };

// const RestaurantList = () => {
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

//   useEffect(() => {
//     const userId = getUserIdFromSession();


//     fetchRestaurants(userId)
//     .then((data) => {
//       console.log("Data from API:", data); // Debugging statement
//       setRestaurants(data); // Make sure data is an array of Restaurant objects
//     })
//     .catch((error) => {
//       console.error('Error fetching restaurants:', error);
//     });
// }, []);


//   return (
//     <div>
//       <h1>Restaurant List</h1>
//       <ul>
//         {restaurants.map((restaurant) => (
//           <li key={restaurant._id}>{restaurant.restaurantName}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RestaurantList;



















// // const getUserIdFromSession = () => {
// //   // Implement this function to retrieve the user ID from the session
// //   // For example, if you are using localStorage:
// //   const userInfo = localStorage.getItem("userInfo");
// //   if (userInfo) {
// //     const userObj = JSON.parse(userInfo);
// //     return userObj._id;
// //   }
// //   return null;
// // };

// // const DisplayRestaurants = () => {
// //   const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // Initialize as empty array
// //     // Call the hook
// //     useEffect(() => {
// //       const fetchData = async () => {
// //         try {
// //           const userId = getUserIdFromSession();

// //           if (!userId) {
// //             console.error("User is not authenticated");
// //             return;
// //           }

// //           const response = await axios.get(`${API_BASE_URL}/api/my/restaurant`, {
// //             params: { userId } // Corrected to pass userId as an object
// //           });

// //           if (!response.data) {
// //             throw new Error("Failed to get restaurant");
// //           }

// //           const restaurants = response.data;

// //           console.log("Restaurant data:", restaurants);
// //         } catch (error) {
// //           console.error("Error fetching restaurant data:", error);
// //         }
// //       };

// //       fetchData();
// //     }, []);

//   // useEffect(() => {
//   //   const fetchRestaurants = async () => {
//   //     try {
//   //       const userId = user;
//   //       console.log(userId)
//   //       if (!userId) {
//   //         console.error('User not authenticated');
//   //         return;
//   //       }
//   //       const response = await axios.get(`${API_BASE_URL}/api/my/restaurant`, {
//   //         params: { userId }
//   //       });
//   //       setRestaurants(response.data);
//   //       console.log(response.data)
//   //     } catch (error) {
//   //       console.error('Error fetching restaurants:', error);
//   //     }
//   //   };

//   //   fetchRestaurants();
//   // }, [user]);


// //   return (
// //     <div>
// //       <h1>Restaurants</h1>
// //       <ul>
// //         {restaurants.map((restaurant) => (
// //           <li key={restaurant._id}>
// //             <h3>{restaurant.restaurantName}</h3>
// //             <p>Estimated Delivery Time: {restaurant.estimatedDeliveryTime} minutes</p>
// //             <p>Cuisines: {restaurant.cuisines.join(', ')}</p>
// //             {/* Render other restaurant details */}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default DisplayRestaurants;





// // // const getUserIdFromSession = () => {
// // //   // Implement this function to retrieve the user ID from the session
// // //   // For example, if you are using localStorage:
// // //   const userData = localStorage.getItem("userData");
// // //   if (userData) {
// // //     const userObj = JSON.parse(userData);
// // //     return userObj.id;
// // //   }
// // //   return null;
// // // };

// // // const fetchRestaurantData = async () => {
// // //   try {
// // //       const userId= "65dc946b32f786ee4a943c23";

// // //     // Make a GET request to the endpoint with userId as a query parameter
// // //     const response = await axios.get(`${API_BASE_URL}/api/my/restaurant`, {
// // //       params: { userId: userId }
// // //     });
// // // console.log('looggg',userId)
// // //     // Check if the request was successful
// // //     if (response.status === 200) {
// // //       // Return the restaurant data
// // //       return response.data;
// // //     } else {
// // //       // Handle other status codes if needed
// // //       throw new Error('Failed to fetch restaurant data');
// // //     }
// // //   } catch (error) {
// // //     // Handle errors
// // //     console.error('Error fetching restaurant data:', error);
// // //     throw error; // Rethrow the error to be handled by the caller
// // //   }
// // // };
// // const getUserIdFromAuthContext = () => {
// //   const { user } = useClerk();
// //   if (user) {
// //     return user.id; // Assuming user.id contains the user ID
// //   } else {
// //     return null; // User not authenticated
// //   }
// // }

// // const DisplayRestaurants = () => {


// //   const [restaurants, setRestaurant] = useState<Restaurant[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);




// //   useEffect(() => {
// //     // Fetch the user ID from your authentication context
// //     const userId = getUserIdFromAuthContext();
// //     console.log(userId, 'userr iss')
// //     if (!userId) {
// //       console.error('User not authenticated');
// //       return;
// //     }

// //     const fetchData = async () => {
// //       try {
// //         const userId = getUserIdFromAuthContext();
// //         if (!userId) {
// //           console.error('User not authenticated');
// //           return;
// //         }

// //         const response = await axios.get(`${API_BASE_URL}/api/my/restaurant`, {
// //           params: { userId }
// //         });

// //         if (response.status === 200) {
// //           setRestaurant(response.data);
// //           setLoading(false);
// //         } else {
// //           throw new Error('Failed to fetch restaurant data');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching restaurant data:', error);
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>Error: </div>;
// //   }

// //   if (!restaurants) {
// //     return <div>No restaurant found</div>;
// //   }

// //   return (
// //     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
// //       <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
// //         Restaurant Details
// //       </h4>

// //       <div className="flex flex-col">
// //         <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
// //           {/* Header content */}
// //         </div>

// //         {restaurants? (
// //           <div className="grid grid-cols-3 sm:grid-cols-5">
// //             {restaurants.map((restaurant, key) => (
// //               <div
// //                 className={`grid grid-cols-3 sm:grid-cols-5 ${key === restaurants.length - 1
// //                     ? ''
// //                     : 'border-b border-stroke dark:border-strokedark'
// //                   }`}
// //                 key={key}
// //               >
// //                 <div className="flex items-center gap-3 p-2.5 xl:p-5">
// //                   {/* Render restaurant logo */}
// //                   <div className="flex-shrink-0">
// //                     <img src={restaurant.imageUrl} alt="Restaurant" />
// //                   </div>
// //                   {/* Render restaurant name */}
// //                   <p className="hidden text-black dark:text-white sm:block">
// //                     {restaurant.restaurantName}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div>No restaurants found</div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };


// // export default DisplayRestaurants;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Restaurant } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';

const BASE_URL = import.meta.env.BASE_URL;

const getUserIdFromSession = () => {
  // Implement this function to retrieve the user ID from the session
  // For example, if you are using localStorage:
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const userObj = JSON.parse(userInfo);
    return userObj._id;
  }
  return null;
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const userid=getUserIdFromSession();
      try {
        const response = await axios.get(`http://localhost:7000/api/my/restaurant`, {
          params: {
            userId: userid // Replace with actual user ID
          }
        });

        setRestaurants(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (



    <DefaultLayout>






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
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === restaurants.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
              }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img width ="55px" src={restaurant.imageUrl} alt="Brand" />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {restaurant.restaurantName}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{restaurant.user}K</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">${restaurant.estimatedDeliveryTime}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{restaurant.cuisines}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{restaurant.lastUpdated}%</p>
            </div>
          </div>
        ))}
      </div>
    </div></DefaultLayout>
  );



}






export default RestaurantList;