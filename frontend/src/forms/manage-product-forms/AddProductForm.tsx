import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetMyRestaurant } from '../../api/MyRestaurantApi';
import io from 'socket.io-client';
import axios from 'axios';
import dishAnimationdata from '../../assets/dish.json';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';

type Restaurant = {
  _id: string;
  restaurantName: string;
};

const DishAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: dishAnimationdata,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={300} width={300} />;
};

const AddProductForm = () => {
  const { restaurant } = useGetMyRestaurant();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const socket = io("http://localhost:8000", { transports: ["websocket"] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token found');
        }
        const userId = localStorage.getItem('userId');

        const response = await axios.get('http://localhost:7000/api/my/restaurant', {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('dishType', data.dishType);
    formData.append('quantity', data.quantity);
    formData.append('restaurant', data.restaurant);

    if (data.imageFile) {
      formData.append('imageFile', data.imageFile[0]);
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:7000/api/my/products', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      navigate('/display-products');
      socket.emit('newProductAdded', responseData.product);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Product" />
      <div className="max-w-4xl mx-auto bg-white shadow-switcher rounded-lg p-9 mt-20 flex">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-1/2 pr-8">
          <div className="grid grid-cols-3 md:grid-cols-2 gap-7 mt-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Product Name"
                {...register('name', { required: true })}
                className="w-full p-1 border rounded-full border-opacity-25"
              />
              {errors.name && <span className="text-red-500">Name is required</span>}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Description"
                {...register('description', { required: true })}
                className="w-full p-1 border rounded-full border-opacity-25"
              />
              {errors.description && <span className="text-red-500">Description is required</span>}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Price"
                {...register('price', { required: true })}
                className="w-full p-1 border rounded-full border-opacity-25"
              />
              {errors.price && <span className="text-red-500">Price is required</span>}
            </div>
            <div className="relative">
              <select
                {...register('dishType', { required: true })}
                className="w-full p-1 border rounded-full border-opacity-25"
              >
                <option value="">Select Dish Type</option>
                <option value="main">Main</option>
                <option value="side">Side</option>
                <option value="beverage">Beverage</option>
                <option value="entry">Entry</option>
                <option value="dessert">Dessert</option>
              </select>
              {errors.dishType && <span className="text-red-500">Dish Type is required</span>}
            </div>
            <div className="relative">
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setValue('quantity', Math.max(getValues('quantity') - 1, 0))}
                  className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  {...register('quantity', { required: true })}
                  className="mx-2 w-25 text-center p-1 border rounded-full border-opacity-25"
                  placeholder="Quantity"
                  style={{ borderBlockColor: 'orange' }}
                  
                />
                <button
                  type="button"

                  onClick={() => setValue('quantity', getValues('quantity') + 1)}
                  className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
                {errors.quantity && <span className="text-red-500">Quantity is required</span>}
              </div>

              {errors.quantity && <span className="text-red-500">Quantity is required</span>}
            </div>
            <div>
              <select
                {...register('restaurant', { required: true })}
                className="w-full p-1 border rounded-full border-opacity-25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
              {errors.restaurant && <span className="text-red-500">Please select a restaurant</span>}
            </div>
          </div>
          <div className="relative">
            <input
              type="file"
              onChange={(e) => {
                setValue('imageFile', e.target.files);
              }}
              className="w-full p-1 border rounded-full border-opacity-25"
            />
            {errors.imageFile && <span className="text-red-500">Image is required</span>}
          </div>

          <div className="flex justify-center mt-100 ">
            <button
              type="submit"
              className="w-55 max-w-xs bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-slate-500"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="w-1/2 flex justify-center items-center">
          <DishAnimation />
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
