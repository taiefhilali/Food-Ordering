import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom
import axios from 'axios';
import '../../assets/css/ProductDetails.css'; // Import CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// Define the type of the product prop
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    imageUrl: string;
};

// Define the prop type for the ProductDetailPage component
type ProductDetailPageProps = {
    product: Product; // Use the Product type for the product prop
};

// Function component for the ProductDetailPage
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Product>({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
        imageUrl: product.imageUrl
    });
    const navigate = useNavigate(); // Ensure useNavigate is used within the function component

    const handleDeleteProduct = async () => {
        try {
            // Send delete request to the API
            await axios.delete(`http://localhost:7000/api/my/products/${product._id}`);
            // Display success message using SweetAlert
            Swal.fire('Success', 'Product deleted successfully', 'success');
            // Redirect to the home page after deletion using navigate
            navigate('/display-products');
        } catch (error) {
            // Display error message using SweetAlert
            Swal.fire('Error', 'Failed to delete product', 'error');
            console.error('Error deleting product:', error);
        }
    };

    // Function to handle form submission for update
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send update request to the API
            await axios.put(`http://localhost:7000/api/my/products/${formData._id}`, formData);
            // Display success message using SweetAlert
            Swal.fire('Success', 'Product updated successfully', 'success');
            // Redirect to the home page or product details page after update using navigate
            navigate('/display-products');
        } catch (error) {
            // Display error message using SweetAlert
            Swal.fire('Error', 'Failed to update product', 'error');
            console.error('Error updating product:', error);
        }
    };

    // Function to handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <DefaultLayout>
                <Breadcrumb pageName="Product Details" />

            <div className="container mx-auto mt-5">
                <div className="max-w-4xl mx-auto bg-white rounded-md shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48" src={product.imageUrl} alt="Product" />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                {/* <Link to="/" className="text-gray-500 hover:text-gray-700">
                                    <i className="fa fa-long-arrow-left"></i>
                                    <span className="ml-1">Back</span>
                                </Link> */}
                            </div>
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                <div className="flex items-center mt-1">
                                    <span className="text-sm text-gray-600 uppercase">{product.category}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                </div>
                                <p className="mt-4 text-gray-600">{product.description}</p>
                                <div className="flex items-center mt-6">
                                    {/* Delete Product Button */}
                                    <button onClick={handleDeleteProduct} className="bg-gray-800 text-black rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                        <i className="fa fa-trash"></i>
                                    </button>
                                    {/* Toggle Edit Form Button */}
                                    <button onClick={() => setIsEditing(true)} className="ml-4 bg-gray-800 text-black rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                        <i className="fa fa-edit"></i>
                                    </button>
                                </div>
                                {/* Update Form */}
                                {isEditing && (
                                    <form onSubmit={handleUpdateSubmit}>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
                                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
                                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
                                        <button type="submit">Update</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ProductDetailPage;
