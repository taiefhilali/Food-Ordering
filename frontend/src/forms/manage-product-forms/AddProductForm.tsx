
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetMyRestaurant } from '../../api/MyRestaurantApi';


type Restaurant = {
  _id: string;
  restaurantName: string;
};
const AddProductForm = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { restaurant, isLoading } = useGetMyRestaurant();
  console.log(restaurants);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRestaurant = await restaurant;
        console.log("Fetched restaurants:", restaurants);

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
    } catch (error) {
      console.error('Error adding product:', errors.message);
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input for Product Name */}
      <input
        type="text"
        placeholder="Product Name"
        {...register('name', { required: true })}
      />
      {errors.name && <span>Name is required</span>}

      {/* Input for Description */}
      <input
        type="text"
        placeholder="Description"
        {...register('description', { required: true })}
      />
      {errors.description && <span>Description is required</span>}

      {/* Input for Price */}
      <input
        type="text"
        placeholder="Price"
        {...register('price', { required: true })}
      />
      {errors.price && <span>Price is required</span>}

      {/* Input for Category */}
      <input
        type="text"
        placeholder="Category"
        {...register('category', { required: true })}
      />
      {errors.category && <span>Category is required</span>}

      {/* Input for Quantity */}
      <input
        type="text"
        placeholder="Quantity"
        {...register('quantity', { required: true })}
      />
      {errors.quantity && <span>Quantity is required</span>}
      <select {...register('restaurant', { required: true })}>
        <option value="">Select Restaurant</option>
        {restaurants && restaurants.map((restaurant) => (
          
          <option key={restaurant._id} value={restaurant._id}>{restaurant.restaurantName}</option>
        ))}
      </select>

      {errors.restaurant && <span>Please select a restaurant</span>}
      {/* Input for Image File Upload */}
      <input
        type="file"
        onChange={(e) => {
          // Update the form value for imageFile when a file is selected
          setValue('imageFile', e.target.files);
        }}
      />
      {errors.imageFile && <span>Image is required</span>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProductForm;
