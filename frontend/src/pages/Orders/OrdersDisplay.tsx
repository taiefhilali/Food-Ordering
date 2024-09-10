// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import io from 'socket.io-client'; // Import Socket.IO client
// // import { Link } from 'react-router-dom';
// // import DefaultLayout from '@/layouts/DefaultLayout';
// // import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

// // // Connect to the server using Socket.IO
// // const socket = io('http://localhost:8000'); // Replace with your backend server URL

// // const OrdersList = () => {
// //   const [orders, setOrders] = useState([]);

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:7000/api/my/invoices/${restaurantName}'); // Replace with your API endpoint
// //         setOrders(response.data.orders); // Assuming API response has an 'orders' array
// //       } catch (error) {
// //         console.error('Error fetching orders:', error);
// //       }
// //     };

// //     fetchOrders();

// //     // Listen for the 'paymentSuccess' event from the server
// //     socket.on('paymentSuccess', (data) => {
// //       console.log('Payment success event received:', data);
// //       // Optionally, refetch orders or update the UI in response to the payment success
// //       fetchOrders();
// //     });

// //     // Clean up the socket connection when the component is unmounted
// //     return () => {
// //       socket.off('paymentSuccess');
// //     };
// //   }, []);

// //   return (
// //     <DefaultLayout>
// //       <Breadcrumb pageName="Display Orders" />
// //       <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
// //         <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
// //           Orders
// //         </h4>

// //         <div className="flex flex-col">
// //           <div className="grid grid-cols-4 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
// //             <div className="p-2.5 xl:p-5">
// //               <h5 className="text-sm font-medium uppercase xsm:text-base">
// //                 Order ID
// //               </h5>
// //             </div>
// //             <div className="p-2.5 text-center xl:p-5">
// //               <h5 className="text-sm font-medium uppercase xsm:text-base">
// //                 Customer Name
// //               </h5>
// //             </div>
// //             <div className="p-2.5 text-center xl:p-5">
// //               <h5 className="text-sm font-medium uppercase xsm:text-base">
// //                 Total Amount
// //               </h5>
// //             </div>
// //             <div className="p-2.5 text-center xl:p-5">
// //               <h5 className="text-sm font-medium uppercase xsm:text-base">
// //                 Actions
// //               </h5>
// //             </div>
// //           </div>

// //           {orders.map((order, index) => (
// //             <div
// //               key={order._id}
// //               className={`grid grid-cols-4 sm:grid-cols-5 ${index === orders.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
// //                 }`}
// //             >
// //               <div className="flex items-center p-2.5 xl:p-5">
// //                 <p className="text-black dark:text-white">{order.orderId}</p>
// //               </div>

// //               <div className="items-center justify-center p-2.5 text-center xl:p-5">
// //                 <p className="text-black dark:text-white">{order.customerName}</p>
// //               </div>

// //               <div className="items-center justify-center p-2.5 text-center xl:p-5">
// //                 <p className="text-black dark:text-white">{order.totalAmount}</p>
// //               </div>

// //               <div className="items-center justify-center p-2.5 text-center xl:p-5">
// //                 <Link to={`/order-details/${order._id}`}>
// //                   <button
// //                     className="rounded border border-stroke py-2 px-6 font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white"
// //                   >
// //                     View Details
// //                   </button>
// //                 </Link>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </DefaultLayout>
// //   );
// // };

// // export default OrdersList;
//   import { useState, useEffect } from 'react';
//   import axios from 'axios';
//   import DefaultLayout from '@/layouts/DefaultLayout'; 
//   import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'; 
//   import React from 'react';
//   import Select, { GroupBase } from 'react-select';
//   import { Controller, useForm } from 'react-hook-form';

//   type Restaurant = {
//     _id: string;
//     restaurantName: string;
//     imageUrl: string;
//   };

//   const customStyles = {
//     control: (provided: any) => ({
//       ...provided,
//       borderRadius: '9999px', // Rounded full
//       padding: '4px',
//       borderColor: '#d1d5db', // Tailwind gray-300
//       boxShadow: 'none',
//       '&:hover': {
//         borderColor: '#fb923c', // Tailwind orange-500
//       },
//     }),
//     menu: (provided: any) => ({
//       ...provided,
//       borderRadius: '0.5rem', // Tailwind rounded-lg
//     }),
//     option: (provided: any, state: { isFocused: any; }) => ({
//       ...provided,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '8px 12px',
//       backgroundColor: state.isFocused ? '#fb923c' : 'white', // Tailwind orange-500 for focused state
//       color: state.isFocused ? 'white' : 'black',
//       '&:active': {
//         backgroundColor: '#fb923c',
//         color: 'white',
//       },
//     }),
//   };

//   const formatOptionLabel = ({ restaurantName, imageUrl }: Restaurant) => (
//     <div className="flex justify-between items-center">
//       <h2>{restaurantName}</h2>
//       <img
//         src={imageUrl}
//         alt={restaurantName}
//         className="w-8 h-8 rounded-full ml-2"
//       />
//     </div>
//   );

//   const InvoicesTable = () => {
//     const [invoices, setInvoices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error] = useState(null);
//     const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

//     const methods = useForm();
//     const { control } = methods;

//     // Fetch invoices
//     useEffect(() => {
//       const fetchAllInvoices = async () => {
//         try {
//           const selectedRestaurantId = localStorage.getItem('selectedRestaurantId');
//           if (!selectedRestaurantId) {
//             throw new Error('Selected restaurant ID not found in local storage');
//           }
//           const response = await axios.get(`http://localhost:7000/api/my/invoice/restaurant/${selectedRestaurantId}`);
//           setInvoices(response.data);
//           console.log(response.data, 'invoices!!');
//         } catch (error) {
//           console.error('Error fetching invoices:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       // const fetchAllInvoices = async () => {
//       //   try {
//       //     const userId = localStorage.getItem('userId');
//       //     if (!userId) {
//       //       throw new Error('User ID not found in local storage');
//       //     }
//       //     const token = localStorage.getItem('userToken');

//       //     const response = await axios.get('http://localhost:7000/api/my/invoice/all'); // Adjust the API endpoint as needed
//       //     setInvoices(response.data);
//       //     console.log(response.data,'invoices!!');
//       //   } catch (error) {
//       //     console.error('Error fetching invoices:', error);
//       //   } finally {
//       //     setIsLoading(false);
//       //   }
//       // };

//       fetchAllInvoices();
//     }, []);

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const token = localStorage.getItem('userToken');
//           if (!token) {
//             throw new Error('No token found');
//           }
//           const userId = localStorage.getItem('userId');

//           const response = await axios.get('http://localhost:7000/api/my/restaurant', {
//             params: { userId },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setRestaurants(response.data);
//         } catch (error) {
//           console.error('Error fetching restaurants:', error);
//         }
//       };

//       fetchData();
//     }, []);

//     const handleRestaurantChange = (selectedRestaurant: Restaurant | null) => {
//       if (selectedRestaurant) {
//         localStorage.setItem('selectedRestaurantId', selectedRestaurant._id);
//       } else {
//         localStorage.removeItem('selectedRestaurantId');
//       }
//     };

//     if (isLoading) return <div>Loading invoices...</div>;
//     if (error) return <div>Error loading invoices</div>;

//     return (
//       <DefaultLayout>
//         <Breadcrumb pageName="Display Invoices" />
//         <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//           <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">All Orders</h4>
//           <div className="overflow-x-auto">
//             <div className="relative">
//               <Controller
//                 name="restaurant"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <Select<Restaurant, false, GroupBase<Restaurant>>
//                     {...field}
//                     options={restaurants}
//                     getOptionLabel={(restaurant) => restaurant.restaurantName}
//                     getOptionValue={(restaurant) => restaurant._id}
//                     formatOptionLabel={formatOptionLabel}
//                     styles={customStyles}
//                     placeholder="Select Restaurant"
//                     onChange={(selected) => {
//                       field.onChange(selected);
//                       handleRestaurantChange(selected as Restaurant);
//                     }}
//                   />
//                 )}
//               />
//             </div>
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
//               <thead className="bg-gray-200 dark:bg-meta-4">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Order ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
//                 {invoices.map((invoice) => (
//                   <React.Fragment key={invoice._id}>
//                     <tr>
//                       <td colSpan="4">
//                         <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark mt-2">
//                           <thead>
//                             <tr>
//                               {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Image</th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Name</th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Quantity</th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Price</th> */}
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
//                             {invoice.items.map((item) => (
//                               <tr key={item._id}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
//                                   <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.name}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">x{item.quantity}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.price} dt</td>
//                               </tr>
//                             ))}
//                             <tr>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-white">Order Summary</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">Total Amount = {invoice.totalAmount} dt</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white"></td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{new Date(invoice.createdAt).toLocaleDateString()}</td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </DefaultLayout>
//     );
//   };

//   export default InvoicesTable;
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React from 'react';
import Select, { GroupBase } from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [readyOrders, setReadyOrders] = useState<Set<string>>(new Set());

  const methods = useForm();
  const { control } = methods;

  // Fetch invoices
  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        const selectedRestaurantId = localStorage.getItem('selectedRestaurantId');
        
        // Check if selectedRestaurantId exists
        if (!selectedRestaurantId) {
          setError('Please select a restaurant to view the invoices.');
          return; // Stop execution if no restaurant is selected
        }
  
        const response = await axios.get(`http://localhost:7000/api/my/invoice/restaurant/${selectedRestaurantId}`);
        
        // Assuming the invoices have a createdAt or updatedAt field
        const sortedInvoices = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setInvoices(sortedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Error fetching invoices');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllInvoices();
  }, []);
  


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
      alert('Customer has been notified!');
    } catch (error) {
      console.error('Error notifying customer:', error);
      alert('Failed to notify customer.');
    }
  };
  
  if (isLoading) return <div>Loading invoices...</div>;
  if (error) return <div>Error loading invoices: {error}</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Display Invoices" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">All Orders</h4>
        <div className="overflow-x-auto">
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
                  onChange={(selected) => {
                    field.onChange(selected);
                    handleRestaurantChange(selected as Restaurant);
                  }}
                />
              )}
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
            <thead className="bg-gray-200 dark:bg-meta-4">
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
    key={invoice._id}
    onClick={() => handleOrderReady(invoice._id)}
    className={`px-4 py-2 rounded-full ${readyOrders.has(invoice._id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
    disabled={readyOrders.has(invoice._id)}
  >
    Order is Ready
  </button>

  {/* <button
    key={invoice._id}
    onClick={() => handleOrderReady(invoice._id)}
    className={`px-4 py-2 rounded-full ${readyOrders.has(invoice._id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
    disabled={readyOrders.has(invoice._id)}
  >
    Order Details
  </button> */}
  <Link to={`/order-details/${invoice._id}`}     className={`px-4 py-2 rounded-full ${readyOrders.has(invoice._id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
  >View Details</Link>

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
