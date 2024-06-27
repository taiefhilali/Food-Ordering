
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useGetMyRestaurant } from '../../api/MyRestaurantApi';
// import Swal from "sweetalert2"
// import { HiOutlineCurrencyDollar, HiOutlineInformationCircle, HiOutlineMenu, HiOutlineClipboardList, HiOutlineViewGrid, HiOutlinePhotograph } from 'react-icons/hi'; // Import icons from Heroicons
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// type Restaurant = {
//   _id: string;
//   restaurantName: string;
// };
// const AddProductForm = () => {
//    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { restaurant, isLoading } = useGetMyRestaurant();
//   // console.log(restaurants);

//   const { register, handleSubmit, setValue, formState: { errors } } = useForm();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedRestaurant = await restaurant;
//         // console.log("Fetched restaurants:", restaurants);

//         setRestaurants(fetchedRestaurant);
//       } catch (error) {
//         console.error('Error setting restaurant data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const onSubmit = async (data:any) => {
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("price", data.price);
//     formData.append("category", data.category);
//     formData.append("quantity", data.quantity);
//     formData.append("restaurant", data.restaurant); // Static restaurant ID

//     if (data.imageFile) {
//       formData.append("imageFile", data.imageFile[0]);
//     }

//     try {
//       const response = await fetch('http://localhost:7000/api/my/products', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add product');
//       }

//       const responseData = await response.json();
//       console.log('Product created successfully:', responseData.product);
//       Swal.fire({
//         icon: 'success',
//         title: 'Product Added',
//         text: 'Product has been added successfully!',
//       });
//     } catch (error) {
//       console.error('Error adding product:', errors.message);
//     }
//   };



//   return (
//     <><Breadcrumb pageName="Add Product" /><div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="grid grid-cols-1 gap-5">
//           <div className="relative">
//             <HiOutlineClipboardList className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <input
//               type="text"
//               placeholder="Product Name"
//               {...register('name', { required: true })}
//               className="w-full p-3 pl-10 border rounded-md" />
//             {errors.name && <span className="text-red-500">Name is required</span>}
//           </div>
//           <div className="relative">
//             <HiOutlineInformationCircle className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <input
//               type="text"
//               placeholder="Description"
//               {...register('description', { required: true })}
//               className="w-full p-3 pl-10 border rounded-md" />
//             {errors.description && <span className="text-red-500">Description is required</span>}
//           </div>
//           <div className="relative">
//             <HiOutlineCurrencyDollar className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <input
//               type="text"
//               placeholder="Price"
//               {...register('price', { required: true })}
//               className="w-full p-3 pl-10 border rounded-md" />
//             {errors.price && <span className="text-red-500">Price is required</span>}
//           </div>
//           <div className="relative">
//             <HiOutlineMenu className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <select {...register('category', { required: true })} className="w-full p-3 pl-10 border rounded-md">
//               <option value="">Select Category</option>
//               <option value="main">Main</option>
//               <option value="side">Side</option>
//               <option value="beverage">Beverage</option>
//               <option value="entry">Entry</option>
//               <option value="dessert">Dessert</option>
//             </select>
//             {errors.category && <span className="text-red-500">Category is required</span>}
//           </div>
//           <div className="relative">
//             <HiOutlineViewGrid className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <input
//               type="text"
//               placeholder="Quantity"
//               {...register('quantity', { required: true })}
//               className="w-full p-3 pl-10 border rounded-md" />
//             {errors.quantity && <span className="text-red-500">Quantity is required</span>}
//           </div>
//           <div className="relative">
//             <select {...register('restaurant', { required: true })} className="w-full p-2 border rounded-md">
//               <option value="">Select Restaurant</option>
//               {restaurants && restaurants.map((restaurant) => (
//                 <option key={restaurant._id} value={restaurant._id}>{restaurant.restaurantName}</option>
//               ))}
//             </select>
//             {errors.restaurant && <span className="text-red-500">Please select a restaurant</span>}
//           </div>
//           <div className="relative">
//             <HiOutlinePhotograph className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
//             <input
//               type="file"
//               onChange={(e) => {
//                 setValue('imageFile', e.target.files);
//               } }
//               className="w-full p-3 pl-10 border rounded-md" />
//             {errors.imageFile && <span className="text-red-500">Image is required</span>}
//           </div>
//         </div>
//         <button type="submit" className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Submit</button>
//       </form>
//     </div></>
// );
// };

// export default AddProductForm;


import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { HiOutlineCurrencyDollar, HiOutlineInformationCircle, HiOutlineMenu, HiOutlineViewGrid, HiOutlinePhotograph } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetMyRestaurant } from '../../api/MyRestaurantApi';
import io from 'socket.io-client'; // Import socket.io-client
import axios from 'axios';

type Restaurant = {
  _id: string;
  restaurantName: string;
};

const AddProductForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { restaurant } = useGetMyRestaurant();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const userToken = localStorage.getItem('userToken');
  console.log('User token:', userToken);
  
  const socket = io('http://localhost:8000', {
    extraHeaders: {
      Authorization: `Bearer ${userToken}`,
    },
  });
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
        // Handle error as needed (e.g., show error message)
      }
    };

    fetchData();
  }, []);
  // WebSocket initialization
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('quantity', data.quantity);
    formData.append('restaurant', data.restaurant); // Static restaurant ID

    if (data.imageFile) {
      formData.append('imageFile', data.imageFile[0]);
    }

    try {
      const token = localStorage.getItem('userToken');
      // const userId = localStorage.getItem('userToken');

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
      // Emit a WebSocket event to notify the server about the new product
     
           socket.emit('newProductAdded',responseData.product);

    } catch (error) {
      console.error('Error adding product:');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Product" />
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Product
            </h3>
          </div>
          <div className="p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-5">
                <div className="relative">
                  <HiOutlineInformationCircle className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder="Product Name"
                    {...register('name', { required: true })}
                    className="w-full p-3 pl-10 border rounded-md"
                  />
                  {errors.name && <span className="text-red-500">Name is required</span>}
                </div>
                <div className="relative">
                  <HiOutlineInformationCircle className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder="Description"
                    {...register('description', { required: true })}
                    className="w-full p-3 pl-10 border rounded-md"
                  />
                  {errors.description && <span className="text-red-500">Description is required</span>}
                </div>
                <div className="relative">
                  <HiOutlineCurrencyDollar className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder="Price"
                    {...register('price', { required: true })}
                    className="w-full p-3 pl-10 border rounded-md"
                  />
                  {errors.price && <span className="text-red-500">Price is required</span>}
                </div>
                <div className="relative">
                  <HiOutlineMenu className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
                  <select
                    {...register('category', { required: true })}
                    className="w-full p-3 pl-10 border rounded-md"
                  >
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
                  <HiOutlineViewGrid className="absolute top-3 left-3 text-gray-400 h-6 w-6 " />
                  <input
                    type="text"
                    placeholder="Quantity"
                    {...register('quantity', { required: true })}
                    className="w-full p-3 pl-10 border rounded-md "
                  />
                  {errors.quantity && <span className="text-red-500">Quantity is required</span>}
                </div>
                <div className="relative">
                  <HiOutlinePhotograph className="absolute top-3 left-3 text-gray-400 h-6 w-6" />
                  <input
                    type="file"
                    onChange={(e) => {
                      setValue('imageFile', e.target.files);
                    }}
                    className="w-full p-3 pl-10 border rounded-md"
                  />
                  {errors.imageFile && <span className="text-red-500">Image is required</span>}
                </div>
                <div className="relative">
                  <select
                    {...register('restaurant', { required: true })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.restaurantName}
                      </option>
                    ))}
                  </select>
                  {errors.restaurant && (
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-red-500 text-sm">
                      Please select a restaurant
                    </span>
                  )}
                </div>


              </div>
              <div className="flex justify-end gap-4.5 mt-6">
                <button
                  type="button"
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex justify-center rounded bg-white border border-orange-500 py-2 px-6 font-medium text-black hover:bg-opacity-90 hover:text-gray-700 hover:border-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
};

export default AddProductForm;
