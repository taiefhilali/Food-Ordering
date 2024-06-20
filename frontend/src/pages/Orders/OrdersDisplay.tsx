import React, { useState, useEffect } from 'react';
import axios from 'axios';
 // Adjust path as per your project structure
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/cart/carts'); // Replace with your API endpoint
        setOrders(response.data.orders); // Assuming API response has an 'orders' array
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <DefaultLayout>
              <Breadcrumb pageName="Display Orders" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Orders
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-4 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Order ID
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Customer Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Total Amount
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Actions
              </h5>
            </div>
          </div>

          {orders.map((order, index) => (
            <div
              key={order._id}
              className={`grid grid-cols-4 sm:grid-cols-5 ${index === orders.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                }`}
            >
              <div className="flex items-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{order.orderId}</p>
              </div>

              <div className="items-center justify-center p-2.5 text-center xl:p-5">
                <p className="text-black dark:text-white">{order.customerName}</p>
              </div>

              <div className="items-center justify-center p-2.5 text-center xl:p-5">
                <p className="text-black dark:text-white">{order.totalAmount}</p>
              </div>

              <div className="items-center justify-center p-2.5 text-center xl:p-5">
                <Link to={`/order-details/${order._id}`}>
                  <button
                    className="rounded border border-stroke py-2 px-6 font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white"
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrdersList;
