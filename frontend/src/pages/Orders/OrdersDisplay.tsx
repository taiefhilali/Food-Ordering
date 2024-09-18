
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React from 'react';
import Select, { GroupBase } from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

type Restaurant = {
  _id: string;
  restaurantName: string;
  imageUrl: string;
};

type InvoiceItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

type Invoice = {
  _id: string;
  items: InvoiceItem[];
  totalAmount: number;
  createdAt: string;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: '9999px',
    padding: '4px',
    borderColor: '#d1d5db',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#fb923c',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0.5rem',
  }),
  option: (provided: any, state: { isFocused: any; }) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: state.isFocused ? '#fb923c' : 'white',
    color: state.isFocused ? 'white' : 'black',
    '&:active': {
      backgroundColor: '#fb923c',
      color: 'white',
    },
  }),
};

const formatOptionLabel = ({ restaurantName, imageUrl }: Restaurant) => (
  <div className="flex justify-between items-center">
    <h2>{restaurantName}</h2>
    <img
      src={imageUrl}
      alt={restaurantName}
      className="w-8 h-8 rounded-full ml-2"
    />
  </div>
);

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const methods = useForm();
  const { control } = methods;
  const [readyOrders, setReadyOrders] = useState<Set<string>>(new Set());



  // Fetch invoices
  // Fetch invoices when selectedRestaurant changes
  useEffect(() => {
    const fetchAllInvoices = async () => {
      if (!selectedRestaurant) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:7000/api/my/invoice/restaurant/${selectedRestaurant._id}`
        );

        const sortedInvoices = response.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setInvoices(sortedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Error fetching invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInvoices();
  }, [selectedRestaurant]);


   // Fetch restaurants
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

  const handleRestaurantChange = (selectedRestaurant: Restaurant | null) => {
    setSelectedRestaurant(selectedRestaurant);
    if (selectedRestaurant) {
      localStorage.setItem('selectedRestaurantId', selectedRestaurant._id);
    } else {
      localStorage.removeItem('selectedRestaurantId');
    }
  };


  const handleOrderReady = async (invoiceId: string) => {
    try {
      const response = await axios.post(`http://localhost:7000/api/my/invoice/${invoiceId}/notify`, {
        message: 'Your order is ready!',
      });

      // Emit the orderReady event to the server
      const socket = io('http://localhost:8000');
      socket.emit('orderReady', {
        invoiceId,
        message: 'Your order is ready!',
        restaurant: 'Your Restaurant Name', // Replace with actual restaurant data
      });

      setReadyOrders((prev) => new Set(prev).add(invoiceId));
      console.log('Notification sent:', response.data);
      // Show success message using Swal
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer has been notified!',
      });
    } catch (error) {
      console.error('Error notifying customer:', error);
      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to notify customer.',
      });
    }
  };

  if (isLoading) return <div>Loading invoices...</div>;
  if (error) return <div>Error loading invoices: {error}</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Display Invoices" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold">All Orders</h4>
        <div className="overflow-x-auto">
          <div className="relative mb-4">
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
                  onChange={(selected) => {
                    field.onChange(selected);
                    handleRestaurantChange(selected as Restaurant);
                  }}
                />
              )}
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
              {invoices.map((invoice, index) => (
                <React.Fragment key={invoice._id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500 dark:text-white">
                      Order #{index + 1}
                      {/* {invoice._id} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {invoice.items.map((item) => (
                        <div key={item._id} className="flex items-center space-x-2">
                          <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-cover rounded-full" />
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {invoice.totalAmount} dt
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      <div className="flex space-x-4">
                        <button
                          className={`px-2 py-1 rounded-full ${readyOrders.has(invoice._id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                          onClick={() => handleOrderReady(invoice._id)}
                          disabled={readyOrders.has(invoice._id)}
                        >
                          {readyOrders.has(invoice._id) ? 'Notified' : 'Order is ready!'}
                        </button>

                        <Link
                          to={`/order-details/${invoice._id}`}
                          className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default InvoicesTable;





//