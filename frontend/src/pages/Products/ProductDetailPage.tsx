import React, { useEffect, useState } from 'react';
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
    dishType: string;
    quantity: number;
    imageUrl: string;
};

// Define the prop type for the ProductDetailPage component
type ProductDetailPageProps = {
    product: Product; // Use the Product type for the product prop
};

// Function component for the ProductDetailPage
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product: initialProduct }) => {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Product>({
        _id: initialProduct._id,
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price,
        dishType: initialProduct.dishType,
        quantity: initialProduct.quantity,
        imageUrl: initialProduct.imageUrl
    });
    const navigate = useNavigate();

    useEffect(() => {
        setProduct(initialProduct);
        setFormData(initialProduct);
    }, [initialProduct]);

    const handleDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('userToken');

            await axios.delete(`http://localhost:7000/api/my/products/${product._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', 'Product deleted successfully', 'success');
            navigate('/display-products');
        } catch (error) {
            Swal.fire('Error', 'Failed to delete product', 'error');
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');

            const response = await axios.put(`http://localhost:7000/api/my/products/${formData._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                Swal.fire('Success', 'Product updated successfully', 'success');
                setProduct(formData);
                setIsEditing(false);
            } else {
                Swal.fire('Error', 'Failed to update product', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update product', 'error');
            console.error('Error updating product:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    imageUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Product Details" />

            <div className="container mx-auto mt-5">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="md:flex" style={{ marginTop: '2cm', marginBottom: '1cm' }}>
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48 rounded-full" src={product.imageUrl} alt="Product" />
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
                                    <span className="text-sm text-gray-600 uppercase">{product.dishType}</span>
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
                                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                        <form onSubmit={handleUpdateSubmit}>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1">Name</label>
                                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="p-2 border rounded-md" />
                                                </div>
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                                                    <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} className="p-2 border rounded-md" />
                                                </div>
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-1">Price</label>
                                                    <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} className="p-2 border rounded-md" />
                                                </div>
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="dishType" className="text-sm font-semibold text-gray-700 mb-1">DishType</label>
                                                    <input type="text" id="dishType" name="dishType" value={formData.dishType} onChange={handleInputChange} className="p-2 border rounded-md" />
                                                </div>
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="quantity" className="text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                                                    <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="p-2 border rounded-md" />
                                                </div>
                                                <div className="flex flex-col mb-4">
                                                    <label htmlFor="image" className="text-sm font-semibold text-gray-700 mb-1">Image</label>
                                                    <input type="file" id="image" name="imageFile" accept="image/*" onChange={handleImageChange} className="p-2 border rounded-md" />
                                                </div>
                                            </div>
                                            <button type="submit" className="bg-white border-2 border-orange-500 text-black rounded-md py-3 px-6 mt-4 focus:outline-none focus:ring-2 focus:ring-yellow-600 flex items-center justify-center">
                                                <span className="font-bold">Save</span>
                                            </button>
                                        </form>
                                    </div>
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
