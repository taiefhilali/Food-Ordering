import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/ProductDetails.css'; // Import CSS file
import '@fortawesome/fontawesome-free/css/all.css';

// Define the type of the product prop
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    imageUrl: string;
    brand: string; // Add brand to match the ProductDetailPage component
};

// Define the prop type for the ProductDetailPage component
type ProductDetailPageProps = {
    product: Product; // Use the Product type for the product prop
};

// Function component for the ProductDetailPage
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    return (
        <div className="container mx-auto mt-5">
            <div className="max-w-4xl mx-auto bg-white rounded-md shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={product.imageUrl} alt="Product" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="text-gray-500 hover:text-gray-700">
                                <i className="fa fa-long-arrow-left"></i>
                                <span className="ml-1">Back</span>
                            </Link>
                            <i className="fa fa-shopping-cart text-gray-500"></i>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-600 uppercase">{product.brand}</span>
                                <span className="mx-2">•</span>
                                <span className="text-sm text-gray-600 uppercase">{product.category}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                            </div>
                            <p className="mt-4 text-gray-600">{product.description}</p>
                            <div className="flex items-center mt-6">
                                <button className="bg-gray-800 text-black rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                    <i className="fa fa-pen"></i>
                                </button>
                                <button className="ml-4 bg-gray-800 text-black rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                    <i className="fa fa-multiply"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductDetailPage;
