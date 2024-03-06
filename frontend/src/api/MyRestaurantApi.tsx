import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Restaurant } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URLVITE_API_BASE_URL;



export const useGetMyRestaurant = () => {
  const { session } = useClerk();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) {
          console.error("User is not authenticated");
          return;
        }

        const accessToken = session.getToken;

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get restaurant");
        }

        const restaurant = await response.json();
        console.log("Restaurant data:", restaurant);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchData();
  }, [session]);

  return {};

  // const {data: restaurant, isLoading }=useQuery ("fetchMyRestaurant",useGetMyRestaurant)
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

      const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
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

      const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
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