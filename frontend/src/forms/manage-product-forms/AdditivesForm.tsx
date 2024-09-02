import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Input from '../../components/Inputs/Input';
import Button from '@mui/material/Button';
import Select from 'react-select';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';


type Adiitives = {
    name: string;
    price: number;
    icon: string;
    // Other fields...
  };
const AdditivesForm = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [additives, setAdditives] = useState<Adiitives[]>([]);

  const onSubmit = async (data: Adiitives) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.post('http://localhost:7000/api/my/products', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
            });

      setAdditives([...additives, response.data.product]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <DefaultLayout>
            <Breadcrumb pageName="Additives" />
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-5 mt-10">
      <h2 className="text-xl font-semibold mb-4">Add New Additive</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Additive Name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <span className="text-red-500"></span>}
        
        <Input
          type="number"
          step="0.01" // Allows decimal values
          placeholder="Price"
          {...register('price', { required: 'Price is required' })}
        />
        {errors.price && <span className="text-red-500"></span>}
        
        <Input
          placeholder="Icon URL"
          {...register('icon', { required: 'Icon URL is required' })}
        />
        {errors.icon && <span className="text-red-500"></span>}

        <button
                type="submit"
                className="bg-orange-500 text-white p-2 rounded-full px-15 mt-10 ml-25 hover:bg-opacity-75 transition-all duration-200"
              >
                Submit
              </button>      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Existing Additives</h3>
        <ul>
          {additives.map((additive, index) => (
            <li key={index} className="flex items-center space-x-3 mb-2">
              <img src={additive.icon} alt={additive.name} className="w-6 h-6" />
              <span>{additive.name} - ${additive.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </DefaultLayout>

  );
};

export default AdditivesForm;
