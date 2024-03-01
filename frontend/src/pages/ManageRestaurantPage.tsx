// Import necessary dependencies and components

import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

export default function ManageRestaurantPage() {
  const handleSave = (restaurantFormData: FormData) => {
    // Implement your logic here to handle the form data submission
    console.log('Form Data:', restaurantFormData);
    // You can make an API request, update the state, or perform any necessary actions.
  };

  return (
    <ManageRestaurantForm onSave={handleSave} isLoading={false} />
  );
}
