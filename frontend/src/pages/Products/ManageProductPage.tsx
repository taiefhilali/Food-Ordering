// Import necessary dependencies and components

import { useCreateProduct, useGetMyProducts } from "@/api/MyProductApi";
import ManageProductForm from "@/forms/manage-product-forms/AddProductForm";


import DefaultLayout from "@/layouts/DefaultLayout";

export default function ManageProductPage() {
  
  const { createProduct, isLoading: isCreateLoading } = useCreateProduct();
  const { products } = useGetMyProducts();
  // const { updateRestaurant, isLoading: isUpdateloading } = useUpdateRestaurant();


  return (  
  <DefaultLayout>
  {/* <ManageRestaurantForm restaurant={restaurant}
    onSave={isEditing? updateRestaurant:createRestaurant} isLoading={isCreateLoading || isUpdateloading} /> */}
     <ManageProductForm product={products} 
    onSave={createProduct} isLoading={isCreateLoading } />
   </DefaultLayout>
);

  
}
