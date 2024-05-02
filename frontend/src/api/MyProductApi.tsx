import { useClerk } from "@clerk/clerk-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    imageUrl: string;
}

// Function to retrieve user ID from the session
const getUserIdFromSession = () => {
  // Implement this function to retrieve the user ID from the session
  // For example, if you are using localStorage:
  const userInfo = localStorage.getItem("registeredUser");
  if (userInfo) {
    const userObj = JSON.parse(userInfo);
    return userObj._id;
  }
  return null;
};

// Hook for fetching products
export const useGetMyProducts = () => {
  const fetchData = async () => {
    try {
      const userId = getUserIdFromSession();

      if (!userId) {
        console.error("User is not authenticated");
        return;
      }

      const response = await axios.get('http://localhost:7000/api/my/products', {
        params: { userId }
      });

      if (!response.data) {
        throw new Error("Failed to get products");
      }

      const products = response.data;

      console.log("Products data:", products);
      return products; // Return the fetched product data
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Throw the error to be caught by useQuery
    }
  };

  const { data: products, isLoading } = useQuery(
    "fetchMyProducts",
    fetchData
  );

  return { products, isLoading };
};

// Hook for creating a new product
export const useCreateProduct = () => {
  const { session } = useClerk();

  const createProductRequest = async (productFormData: FormData): Promise<Product> => {
    try {
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const accessToken = session.getToken();

      const response = await axios.post(`http://localhost:7000/api/my/products`, productFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) {
        throw new Error("Failed to create product");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const {
    mutate: createProduct,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createProductRequest);

  if (isSuccess) {
    toast.success("Product created!");
  }

  if (error) {
    toast.error("Unable to create product");
  }

  return { createProduct, isLoading, isSuccess, error };
};

// Hook for updating an existing product
export const useUpdateProduct = () => {
  const { session } = useClerk();

  const updateProductRequest = async (productFormData: FormData): Promise<Product> => {
    try {
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const accessToken = session.getToken();

      const response = await axios.put(`http://localhost:7000/api/my/products`, productFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) {
        throw new Error("Failed to update product");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const {
    mutate: updateProduct,
    isLoading,
    isSuccess,
    error,
  } = useMutation(updateProductRequest);

  if (isSuccess) {
    toast.success("Product updated!");
  }

  if (error) {
    toast.error("Unable to update product");
  }

  return { updateProduct, isLoading, isSuccess, error };
};
