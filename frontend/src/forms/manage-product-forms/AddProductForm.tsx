/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetMyRestaurant } from '../../api/MyRestaurantApi';
import io from 'socket.io-client';
import axios from 'axios';
import dishAnimationdata from '../../assets/dish.json';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import TextEditor from '@/components/TextEditor';
import Select, { GroupBase } from 'react-select';
import Input from '../../components/Inputs/Input'; // Adjust the import path accordingly
import QuantityInput from '../../components/Inputs/QuantityInput'; // Adjust the import path accordingly

// Define the type for the options
type RestaurantOption = {
  _id: string;
  restaurantName: string;
  imageUrl: string;
};
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import AdditivesInput from './AdditivesInput';
type Restaurant = {
  _id: string;
  restaurantName: string;
  imageUrl: string;
};
interface Product {
  _id: string;
  name: string;
  cost: number;
  dishType: string;
  restaurant: string;
  soldQuantity: number;
  revenue: number;
  createdAt: string;
  likes: string[];
  additives: string[];
  totalRevenue: number;
  description?: string;
  imageUrl?: string;
  isApproved?: boolean;
}

// Define the props for ManageProductForm
interface ManageProductFormProps {
  product: Product; // Adjust this type if necessary
  onSave: (data: FormData) => void;
  isLoading: boolean;
}

const DishAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: dishAnimationdata,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};
// Define a styled input using MUI's styled API
const StyledInput = styled(QuantityInput)`
  width: 150px;
  text-align: center;
  padding: 8px;
  border-radius: 30px;
  border: 1px solid #ccc;
  &:focus {
    outline: none;
    border-color: orange;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }
`;  

const AddProductForm:React.FC<ManageProductFormProps> = ({  }) => {
  useGetMyRestaurant();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const methods = useForm();
  const { register, handleSubmit, setValue, getValues, formState: { errors }, control } = methods;
  const socket = io("http://localhost:8000", { transports: ["websocket"] });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/categories');
        setCategories(response.data.map((category: { _id: any; title: any; imageUrl: any }) => ({ value: category._id, label: category.title })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const dishTypes = [
    { value: '', label: 'Select Dish Type' },
    { value: 'main', label: 'Main' },
    { value: 'side', label: 'Side' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'entry', label: 'Entry' },
    { value: 'dessert', label: 'Dessert' },
  ];


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
    formData.append('cost', data.cost);
    formData.append('dishType', data.dishType?.value || '');
    formData.append('quantity', data.quantity);
    formData.append('restaurant', data.restaurant?._id || '');
    formData.append('additives', JSON.stringify(data.additives));
    console.log('=============additives=======================');
    console.log(data.additives);
    console.log('=============additives=======================');
    if (data.imageFile?.[0]) {
      formData.append('imageFile', data.imageFile[0]);
    }
    if (data.category?.value) {
      formData.append('category', data.category.value);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the product.',
      });
    }
  };


  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '9999px', // Rounded full
      padding: '4px',
      borderColor: '#d1d5db', // Tailwind gray-300
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#fb923c', // Tailwind orange-500
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem', // Tailwind rounded-lg
    }),
    option: (provided: any, state: { isFocused: any; }) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      backgroundColor: state.isFocused ? '#fb923c' : 'white', // Tailwind orange-500 for focused state
      color: state.isFocused ? 'white' : 'black',
      '&:active': {
        backgroundColor: '#fb923c',
        color: 'white',
      },
    }),
  };


  // Update the formatOptionLabel function with proper typing
  const formatOptionLabel = ({ restaurantName, imageUrl }: RestaurantOption) => (
    <div className="flex justify-between items-center">
      <span>{restaurantName}</span>
      <img
        src={imageUrl}
        alt={restaurantName}
        className="w-8 h-8 rounded-full ml-2"
      />
    </div>
  );
  // const formatOptionLabel = ({ restaurantName, imageUrl }) => (
  //   <div className="flex justify-between items-center">
  //     <span>{restaurantName}</span>
  //     <img
  //       src={imageUrl}
  //       alt={restaurantName}
  //       className="w-8 h-8 rounded-full ml-2"
  //     />
  //   </div>
  // );

  return (
    <>
      <Breadcrumb pageName="Add Product" />
      <div className="max-w-4xl mx-auto bg-white shadow-switcher rounded-lg p-9 mt-20 flex border-orange-500 border-opacity-45 border-2">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full md:w-full pr-8">

            <div className="mt-0">
              <h6 className='flex justify-center items-center font-semibold  border-meta-8'>Fill this form to add your item 💭</h6>
              <DishAnimation />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
              <div className="relative">
                <Input
                  placeholder="Product Name"
                  {...register('name', { required: true })}
                />
                {/* <input
                  type="text"
                  placeholder="Product Name"
                  {...register('name', { required: true })}
                  className="w-full p-2 border rounded-full border-gray-300 focus:outline-none font-medium focus:ring-2 focus:ring-orange-500"
                /> */}
                {errors.name && <span className="text-red-500">Name is required</span>}
              </div>

              <div className="relative">
                <Input
                  placeholder="Price(dt)"
                  {...register('price', { required: true })}
                />
                {/* <input
                  type="text"
                  placeholder="Price"
                  {...register('price', { required: true })}
                  className="w-full p-2 border rounded-full border-gray-300 focus:outline-none font-medium focus:ring-2 focus:ring-orange-500"
                /> */}
                {errors.price && <span className="text-red-500">Price is required</span>}
                <Controller
                  name="cost"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Cost"
                      required
                      error={Boolean(errors.cost)}
                    />
                  )}
                />
              </div>

              <div className="relative">
                <Controller
                  name="dishType"
                  control={control}
                  rules={{ required: 'Dish Type is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={dishTypes}
                      styles={customStyles}
                      placeholder="Select Dish Type"
                      onChange={(selected) => field.onChange(selected)}
                    />

                  )}
                />
                {errors.dishType && <span className="text-red-500">DishType is required </span>}

                <Controller
                  name="category" // Make sure this matches the field name in your schema
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categories}
                      styles={customStyles}
                      placeholder="Select Category"
                      onChange={(selected) => field.onChange(selected)}
                    />
                  )}
                />

              </div>

              <div className="relative">
                <Controller
                  name="restaurant"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select<Restaurant, false, GroupBase<Restaurant>>
                      {...field}
                      options={restaurants}
                      getOptionLabel={(restaurant) => restaurant.restaurantName}
                      getOptionValue={(restaurant) => restaurant._id}
                      formatOptionLabel={formatOptionLabel}
                      styles={customStyles}
                      placeholder="Select Restaurant"
                      onChange={(selected) => field.onChange(selected)}
                    />
                  )}
                />
                {errors.restaurant && <span className="text-red-500">Please select a restaurant</span>}
                <div className="ml-5 mt-3">
                  {/* <Link to="/additives" className="text-orange-500 flex items-center">
                <AddCircleIcon fontSize="sm" /> 
                <span className="ml-2">Add more additives</span>
              </Link> */}
                  <AdditivesInput />

                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="relative flex items-center space-x-4">
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => setValue('quantity', Math.max(getValues('quantity') - 1, 0))}
                >
                  -
                </Button>
                <StyledInput
                  type="number"
                  {...register('quantity', { required: true })}
                  placeholder="Quantity"
                />
                {errors.quantity && <span className="text-red-500">Quantity is required</span>}
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => setValue('quantity', getValues('quantity') + 1)}
                >
                  +
                </Button>
                {errors.quantity && <span className="text-red-500">Quantity is required</span>}
              </div>
              <div className="relative flex items-center">
                <Input
                  type='file'
                  placeholder="Select Your Image"
                  {...register('imageFile', { required: true })}
                />
                {errors.imageFile && <span className="text-red-500">Image is required</span>}
              </div>
            </div>

            <div className="relative mt-4">
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    disabled={field.disabled}
                  />
                )}
              />
              {errors.description && <span className="text-red-500">Description is required</span>}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-orange-500 text-white p-2 rounded-full px-15 mt-10 hover:bg-opacity-75 transition-all duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
      </div >
    </>
  );
};

export default AddProductForm;

