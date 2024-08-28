// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client'; // Import Socket.IO client
// import { Link } from 'react-router-dom';
// import DefaultLayout from '@/layouts/DefaultLayout';
// import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

// // Connect to the server using Socket.IO
// const socket = io('http://localhost:8000'); // Replace with your backend server URL

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:7000/api/my/invoices/${restaurantName}'); // Replace with your API endpoint
//         setOrders(response.data.orders); // Assuming API response has an 'orders' array
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();

//     // Listen for the 'paymentSuccess' event from the server
//     socket.on('paymentSuccess', (data) => {
//       console.log('Payment success event received:', data);
//       // Optionally, refetch orders or update the UI in response to the payment success
//       fetchOrders();
//     });

//     // Clean up the socket connection when the component is unmounted
//     return () => {
//       socket.off('paymentSuccess');
//     };
//   }, []);

//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Display Orders" />
//       <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//         <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//           Orders
//         </h4>

//         <div className="flex flex-col">
//           <div className="grid grid-cols-4 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
//             <div className="p-2.5 xl:p-5">
//               <h5 className="text-sm font-medium uppercase xsm:text-base">
//                 Order ID
//               </h5>
//             </div>
//             <div className="p-2.5 text-center xl:p-5">
//               <h5 className="text-sm font-medium uppercase xsm:text-base">
//                 Customer Name
//               </h5>
//             </div>
//             <div className="p-2.5 text-center xl:p-5">
//               <h5 className="text-sm font-medium uppercase xsm:text-base">
//                 Total Amount
//               </h5>
//             </div>
//             <div className="p-2.5 text-center xl:p-5">
//               <h5 className="text-sm font-medium uppercase xsm:text-base">
//                 Actions
//               </h5>
//             </div>
//           </div>

//           {orders.map((order, index) => (
//             <div
//               key={order._id}
//               className={`grid grid-cols-4 sm:grid-cols-5 ${index === orders.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
//                 }`}
//             >
//               <div className="flex items-center p-2.5 xl:p-5">
//                 <p className="text-black dark:text-white">{order.orderId}</p>
//               </div>

//               <div className="items-center justify-center p-2.5 text-center xl:p-5">
//                 <p className="text-black dark:text-white">{order.customerName}</p>
//               </div>

//               <div className="items-center justify-center p-2.5 text-center xl:p-5">
//                 <p className="text-black dark:text-white">{order.totalAmount}</p>
//               </div>

//               <div className="items-center justify-center p-2.5 text-center xl:p-5">
//                 <Link to={`/order-details/${order._id}`}>
//                   <button
//                     className="rounded border border-stroke py-2 px-6 font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:text-white"
//                   >
//                     View Details
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DefaultLayout>
//   );
// };

// export default OrdersList;
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout'; // Adjust path as needed
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'; // Adjust path as needed
import { log } from 'console';
import React from 'react';

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);

  // Fetch invoices
  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/invoice/all'); // Adjust the API endpoint as needed
        setInvoices(response.data);
        console.log(response.data,'invoices!!');
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInvoices();
  }, []);

  if (isLoading) return <div>Loading invoices...</div>;
  if (error) return <div>Error loading invoices</div>;

  return (<DefaultLayout>
    <Breadcrumb pageName="Display Invoices" />
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">All Invoices</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
          <thead className="bg-gray-200 dark:bg-meta-4">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
            {invoices.map((invoice) => (
              <React.Fragment key={invoice._id}>
           
                <tr>
                  <td colSpan="4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark mt-2">
                      <thead>
                        <tr>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Image</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Price</th> */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
                        {invoice.items.map((item) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">x{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.price} dt</td>
                          </tr>
                        ))}
     <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-white">Order Summary </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{invoice.totalAmount} dt</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{invoice.discount} dt</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
  //   <DefaultLayout>
  //   <Breadcrumb pageName="Display Invoices" />
  //   <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  //     <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
  //       All Invoices
  //     </h4>
  //     <div className="overflow-x-auto">
  //       <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
  //         <thead className="bg-gray-200 dark:bg-meta-4">
  //           <tr>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Image</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Name</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Quantity</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Price</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
  //           {invoices.map((invoice) => (
  //             <React.Fragment key={invoice._id}>
  //               {invoice.items.map((item) => (
  //                 <tr key={item._id}>
  //                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{invoice._id}</td> */}
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
  //                     <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.name}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">x{item.quantity}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.price} dt</td>
  //                 </tr>
  //               ))}
  //             </React.Fragment>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // </DefaultLayout>
  );
};

export default InvoicesTable;
