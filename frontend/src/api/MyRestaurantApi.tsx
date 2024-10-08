import { useClerk } from "@clerk/clerk-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Restaurant } from "@/types";
import axios from "axios";
import Swal from "sweetalert2";
import io from 'socket.io-client'; // Import socket.io-client




export const useGetMyRestaurant = () => {
  const fetchData = async () => {
    try {
      const userToken = localStorage.getItem('userToken');

      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('No token found');
      }


      const response = await axios.get('http://localhost:7000/api/my/restaurant', {
        params: { userId },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },

      });

      if (!response.data) {
        throw new Error("Failed to get restaurant");
      }

      const restaurant = response.data;

      console.log("Restaurant data:", restaurant);
      return restaurant; // Return the fetched restaurant data
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      throw error; // Throw the error to be caught by useQuery
    }
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchMyRestaurant",
    fetchData
  );

  return { restaurant, isLoading };
};

export const useCreateMyRestaurant = () => {
  const userToken = localStorage.getItem('userToken');
  console.log('User token:', userToken);

  const socket = io('http://localhost:8000', {
    multiplex:false,
    transports: ['websocket', 'polling', 'flashsocket'],
    extraHeaders: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  const createMyRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:7000/api/my/restaurant', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: restaurantFormData,
      });

      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create restaurant');
      }

      const responseData = await response.json();

      // Emit WebSocket event
      socket.emit('newRestaurantAdded', responseData.restaurant);

      return responseData.restaurant;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  };

  const {
    mutate: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createMyRestaurantRequest, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Restaurant Created',
        text: 'Your restaurant has been created successfully!',
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Unable to create restaurant: ${error.message}`,
      });
    },
  });

  return { createRestaurant, isLoading, isSuccess, error };
};
// export const useCreateMyRestaurant = () => {
//   const { session } = useClerk();

//   const createMyRestaurantRequest = async (
//     restaurantFormData: FormData
//   ): Promise<Restaurant> => {
//     try {
//       if (!session) {
//         throw new Error("User is not authenticated");
//       }

//       const accessToken = session.getToken;

//       const response = await fetch(`http://localhost:7000/api/my/restaurant`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: restaurantFormData,
//       });
//       console.log('=============response data add=======================');
//       console.log('User logged in successfully:', response.data);
//       console.log('====================================');
//       if (!response.ok) {
//         throw new Error("Failed to create restaurant");
//       }

//       return response.json();
//     } catch (error) {
//       console.error("Error creating restaurant:", error);
//       throw error;
//     }
//   };

//   const {
//     mutate: createRestaurant,
//     isLoading,
//     isSuccess,
//     error,
//   } = useMutation(createMyRestaurantRequest);

//   if (isSuccess) {
//     toast.success("Restaurant created!");
//   }

//   if (error) {
//     toast.error("Unable to create restaurant");
//   }

//   return { createRestaurant, isLoading, isSuccess, error };
// };


export const useUpdateRestaurant = () => {
  const { session } = useClerk();
  const updateMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    try {
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const accessToken = session.getToken;

      const response = await fetch(`http://localhost:7000/api/my/restaurant`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: restaurantFormData,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to update restaurant");
      }

      return response.json();

    } catch (error) {
      console.error("Error update restaurant:", error);
      throw error;
    }
  };
  const {
    mutate: updateRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(updateMyRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant updated!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isLoading, isSuccess, error };
};