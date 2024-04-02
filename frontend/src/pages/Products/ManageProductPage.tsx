// Import necessary dependencies and components

import { useCreateProduct, useGetMyProducts } from "@/api/MyProductApi";
import ManageProductForm from "@/forms/manage-product-forms/AddProductForm";

import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function ManageProductPage() {
  
  const { createProduct, isLoading: isCreateLoading } = useCreateProduct();
  const { products } = useGetMyProducts();
  // const { updateRestaurant, isLoading: isUpdateloading } = useUpdateRestaurant();
  const isEditing = !!products;

  const handleSave = (restaurantFormData: FormData) => {
    // Implement your logic here to handle the form data submission
    console.log('Form Data:', restaurantFormData);

    // You can make an API request, update the state, or perform any necessary actions.
  };

  return (  
  <DefaultLayout>
  {/* <ManageRestaurantForm restaurant={restaurant}
    onSave={isEditing? updateRestaurant:createRestaurant} isLoading={isCreateLoading || isUpdateloading} /> */}
     <ManageProductForm product={products}
    onSave={createProduct} isLoading={isCreateLoading } />
   </DefaultLayout>
);

  
}
