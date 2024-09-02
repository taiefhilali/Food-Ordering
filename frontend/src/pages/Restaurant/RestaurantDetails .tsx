import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Restaurant } from '@/types';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FaClock } from 'react-icons/fa';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedRestaurant, setUpdatedRestaurant] = useState<Restaurant | null>(null);
  const [file, setFile] = useState<File | null>(null); // State to hold the selected file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`http://localhost:7000/api/restaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) throw new Error("Failed to get restaurant details");

        setRestaurant(response.data);
        setUpdatedRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        setError("Failed to fetch restaurant details. Please check the console for more details.");
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:7000/api/restaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/display-restaurant-details');
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setError("Failed to delete restaurant. Please check the console for more details.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      // Prepare form data for the image upload
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }

      await axios.put(`http://localhost:7000/api/my/restaurant/${id}`, {
        ...updatedRestaurant,
        imageUrl: file ? URL.createObjectURL(file) : updatedRestaurant?.imageUrl
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setRestaurant(updatedRestaurant);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      setError("Failed to update restaurant. Please check the console for more details.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedRestaurant(prevState => prevState ? { ...prevState, [name]: value } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Restaurant Details" />

      <div className="relative max-w-md mx-auto rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="absolute top-4 right-4 flex flex-col items-center">
          <FaClock size={24} className="text-gray-500 dark:text-gray-400" />
          <span className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            {restaurant.estimatedDeliveryTime} mn
          </span>
        </div>
        <div className="flex items-start">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.restaurantName}
            className="w-24 h-24 rounded-full mb-15 border-2 border-gray-300 mr-6"
          />
          <div className="flex-1">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {restaurant.restaurantName}
            </h4>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisines.map((cuisine, index) => (
                  <span
                    key={index}
                    className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full dark:bg-blue-600"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleEdit}
            className="text-orange-500 hover:text-orange-600"
            aria-label="Edit"
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete"
          >
            <FiTrash size={20} />
          </button>
        </div>
        {isEditing && (
          <div className="mt-6">
            <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Edit Restaurant Details
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                name="restaurantName"
                value={updatedRestaurant?.restaurantName || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-gray-50 p-2 dark:bg-boxdark dark:border-strokedark"
                placeholder="Restaurant Name"
              />
              <input
                type="text"
                name="estimatedDeliveryTime"
                value={updatedRestaurant?.estimatedDeliveryTime || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-gray-50 p-2 dark:bg-boxdark dark:border-strokedark"
                placeholder="Estimated Pick up Time"
              />
              <input
                type="file"
                name="imageUrl"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-stroke bg-gray-50 p-2 dark:bg-boxdark dark:border-strokedark"
                placeholder="Upload Image"
              />
              {/* Add more fields as necessary */}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-orange-500 text-white py-2 px-10 rounded-lg mr-15 hover:bg-orange-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default RestaurantDetails;
