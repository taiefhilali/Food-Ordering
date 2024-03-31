import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Restaurant } from "@/types";
import axios from "axios";
import { useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.BASE_URL;

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
// export const useGetMyRestaurant = () => {
//   const { session } = useClerk();

//   const getMyRestaurantRequest = async (): Promise<Restaurant> => {
//      if (!session) {
//         throw new Error("User is not authenticated");
//       }
//     const accessToken = session.getToken;
//     console.log(accessToken)
//     if (!accessToken) {
//       throw new Error("User email not available");
//     }

//     const response = await fetch(`http://localhost:7000/api/my/restaurant`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to get restaurant");
//     }
//     return response.json();
//   };

//   const { data: restaurant, isLoading } = useQuery(
//     "fetchMyRestaurant",
//     getMyRestaurantRequest
//   );

//   return { restaurant, isLoading };
// };








export const useGetMyRestaurant = () => {
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
  const { session } = useClerk();

  const createMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    try {
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const accessToken = session.getToken;

      const response = await fetch(`http://localhost:7000/api/my/restaurant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: restaurantFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to create restaurant");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  };

  const {
    mutate: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createMyRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant created!");
  }

  if (error) {
    toast.error("Unable to create restaurant");
  }

  return { createRestaurant, isLoading, isSuccess, error };
};


export const useUpdateRestaurant=()=>{
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
    mutate:updateRestaurant,
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