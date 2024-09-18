// OrderDetails.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

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

const OrderDetails = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/my/invoice/${id}`);
                setInvoice(response.data);
                console.log("invoi", response.data);
            } catch (error) {
                setError('Error fetching invoice details');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);
    const handleExportPDF = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/my/invoice/generate-pdf/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Order Details'></Breadcrumb>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Order Details</h4>
                {invoice ? (
                    <div>
                        <div>
                        {/* Invoice details and items rendering */}
                        {/* Add Export PDF button */}
                        <button onClick={handleExportPDF} className="mt-4 px-6 py-2 ml-203 bg-orange-500 text-white rounded">
                            Export PDF
                        </button>
                    </div>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark">

                            <thead className="bg-gray-200 dark:bg-meta-4">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Invoice ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Ordered At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-orange-500 dark:text-orange-500">Current Order Details</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{invoice.totalAmount} dt</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white"> {new Date(invoice.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false, // Use 24-hour time format; set to true for 12-hour format
                                    })}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Items:</h3>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-strokedark mt-2">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-strokedark">
                                {invoice.items.map(item => (
                                    <tr key={item._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">x{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{item.price} dt</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>No invoice found</div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default OrderDetails;
