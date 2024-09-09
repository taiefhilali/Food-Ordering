  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import DefaultLayout from '@/layouts/DefaultLayout'; 
  import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'; 
  import React from 'react';





  const OrdersTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error] = useState(null);


    // Fetch invoices
    useEffect(() => {

      const fetchAllInvoices = async () => {
        try {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            throw new Error('User ID not found in local storage');
          }
          const token = localStorage.getItem('userToken');

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

    return (
      <DefaultLayout>
        <Breadcrumb pageName="Display Invoices" />
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">All Orders</h4>
          <div className="overflow-x-auto">
       
            <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">
              <thead className="bg-gray-200 dark:bg-meta-4">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"></th>
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-white">Order Summary</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">Total Amount = {invoice.totalAmount} dt</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white"></td>
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
    );
  };

  export default OrdersTable;