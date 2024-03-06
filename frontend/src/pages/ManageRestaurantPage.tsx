// Import necessary dependencies and components

import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateRestaurant } from "@/api/MyRestaurantApi";
import Sidebar from "@/components/Sidebar ";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

export default function ManageRestaurantPage() {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateloading } = useUpdateRestaurant();
  const isEditing = !!restaurant;

  // const handleSave = (restaurantFormData: FormData) => {
  //   // Implement your logic here to handle the form data submission
  //   console.log('Form Data:', restaurantFormData);
  //   // You can make an API request, update the state, or perform any necessary actions.
  // };

  return (<>  
  <ManageRestaurantForm restaurant={restaurant}
    onSave={isEditing? updateRestaurant:createRestaurant} isLoading={isCreateLoading || isUpdateloading} />
</>);
  
}
