// Import necessary dependencies and components

import { useCreateMyRestaurant, useGetMyRestaurant } from "@/api/MyRestaurantApi";

import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function ManageRestaurantPage() {
  
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  // const { updateRestaurant, isLoading: isUpdateloading } = useUpdateRestaurant();


  return (  
  <DefaultLayout>
  {/* <ManageRestaurantForm restaurant={restaurant}
    onSave={isEditing? updateRestaurant:createRestaurant} isLoading={isCreateLoading || isUpdateloading} /> */}
     <ManageRestaurantForm restaurant={restaurant}
    onSave={createRestaurant} isLoading={isCreateLoading } />
   </DefaultLayout>
);

  
}
