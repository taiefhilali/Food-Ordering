
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetMyRestaurant } from '../../api/MyRestaurantApi';
import Swal from "sweetalert2"
import { HiOutlineCurrencyDollar, HiOutlineInformationCircle, HiOutlineMenu, HiOutlineClipboardList, HiOutlineViewGrid, HiOutlinePhotograph } from 'react-icons/hi'; // Import icons from Heroicons
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

type Restaurant = {
  _id: string;
  restaurantName: string;
};
const AddProductForm = () => {
   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { restaurant, isLoading } = useGetMyRestaurant();
  // console.log(restaurants);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRestaurant = await restaurant;
        // console.log("Fetched restaurants:", restaurants);

        setRestaurants(fetchedRestaurant);
      } catch (error) {
        console.error('Error setting restaurant data:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data:any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("quantity", data.quantity);
    formData.append("restaurant", data.restaurant); // Static restaurant ID

    if (data.imageFile) {
      formData.append("imageFile", data.imageFile[0]);
    }

    try {
      const response = await fetch('http://localhost:7000/api/my/products', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const responseData = await response.json();
      console.log('Product created successfully:', responseData.product);
      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'Product has been added successfully!',
      });
    } catch (error) {
      console.error('Error adding product:', errors.message);
    }
  };



  return (
    <><Breadcrumb pageName="Add Product" /><div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-5">
          <div className="relative">
            <HiOutlineClipboardList className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Product Name"
              {...register('name', { required: true })}
              className="w-full p-3 pl-10 border rounded-md" />
            {errors.name && <span className="text-red-500">Name is required</span>}
          </div>
          <div className="relative">
            <HiOutlineInformationCircle className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Description"
              {...register('description', { required: true })}
              className="w-full p-3 pl-10 border rounded-md" />
            {errors.description && <span className="text-red-500">Description is required</span>}
          </div>
          <div className="relative">
            <HiOutlineCurrencyDollar className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Price"
              {...register('price', { required: true })}
              className="w-full p-3 pl-10 border rounded-md" />
            {errors.price && <span className="text-red-500">Price is required</span>}
          </div>
          <div className="relative">
            <HiOutlineMenu className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <select {...register('category', { required: true })} className="w-full p-3 pl-10 border rounded-md">
              <option value="">Select Category</option>
              <option value="main">Main</option>
              <option value="side">Side</option>
              <option value="beverage">Beverage</option>
              <option value="entry">Entry</option>
              <option value="dessert">Dessert</option>
            </select>
            {errors.category && <span className="text-red-500">Category is required</span>}
          </div>
          <div className="relative">
            <HiOutlineViewGrid className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Quantity"
              {...register('quantity', { required: true })}
              className="w-full p-3 pl-10 border rounded-md" />
            {errors.quantity && <span className="text-red-500">Quantity is required</span>}
          </div>
          <div className="relative">
            <select {...register('restaurant', { required: true })} className="w-full p-2 border rounded-md">
              <option value="">Select Restaurant</option>
              {restaurants && restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>{restaurant.restaurantName}</option>
              ))}
            </select>
            {errors.restaurant && <span className="text-red-500">Please select a restaurant</span>}
          </div>
          <div className="relative">
            <HiOutlinePhotograph className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
            <input
              type="file"
              onChange={(e) => {
                setValue('imageFile', e.target.files);
              } }
              className="w-full p-3 pl-10 border rounded-md" />
            {errors.imageFile && <span className="text-red-500">Image is required</span>}
          </div>
        </div>
        <button type="submit" className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Submit</button>
      </form>
    </div></>
);
};

export default AddProductForm;
