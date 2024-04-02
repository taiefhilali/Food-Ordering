import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios'; // Import Axios
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'; // Assuming Breadcrumb is defined in a separate component

// Define the Product interface
interface Product {
    productName: string;
    productDescription: string;
    productPrice: string;
    productImage: string;
}

const ProductForm: React.FC = () => {
    const [formData, setFormData] = useState<Product>({
        productName: '',
        productDescription: '',
        productPrice: '',
        productImage: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Make POST request using Axios
            const response = await axios.post(`http://localhost:7000//api/my/products`, formData);
            console.log(response.data); // Log response data
            // Optionally, you can handle success or navigate to another page
        } catch (error) {
            console.error('Error:', error); // Log any errors
            // Optionally, you can display an error message to the user
        }
    };

    return (
        <div className="mx-auto max-w-270">
            <Breadcrumb pageName="Settings" />

            {/* Product Information Form */}
            <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Product Information
                            </h3>
                        </div>
                        <div className="p-7">
                            <form onSubmit={handleSubmit}>
                                {/* Product Name */}
                                <div className="mb-5.5">
                                    <label htmlFor="productName" className="mb-3 block text-sm font-medium text-black dark:text-white">Product Name</label>
                                    <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" />
                                </div>

                                {/* Product Description */}
                                <div className="mb-5.5">
                                    <label htmlFor="productDescription" className="mb-3 block text-sm font-medium text-black dark:text-white">Product Description</label>
                                    <textarea id="productDescription" name="productDescription" value={formData.productDescription} onChange={handleChange} rows={4} className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"></textarea>
                                </div>

                                {/* Product Price */}
                                <div className="mb-5.5">
                                    <label htmlFor="productPrice" className="mb-3 block text-sm font-medium text-black dark:text-white">Product Price</label>
                                    <input type="text" id="productPrice" name="productPrice" value={formData.productPrice} onChange={handleChange} className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" />
                                </div>

                                {/* Product Image */}
                                <div className="mb-5.5">
                                    <label htmlFor="productImage" className="mb-3 block text-sm font-medium text-black dark:text-white">Product Image</label>
                                    <input type="file" id="productImage" name="productImage" className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4.5">
                                    <button type="submit" className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90">
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
