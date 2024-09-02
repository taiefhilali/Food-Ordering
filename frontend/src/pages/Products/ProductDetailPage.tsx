import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom
import axios from 'axios';
import '../../assets/css/ProductDetails.css'; // Import CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import DefaultLayout from '@/layouts/DefaultLayout';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import HTMLContent from '../../components/HTMLContent'; // Adjust the import path accordingly
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import MultiSelect from '@/components/Forms/MultiSelect';

// Define the type of the product prop
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    cost: number; // Added cost field
    dishType: string;
    quantity: number;
    imageUrl: string;
    category: string;
};

// Define the prop type for the ProductDetailPage component
type ProductDetailPageProps = {
    product: Product; // Use the Product type for the product prop
};

const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (provided: any) => ({
        ...provided,
        borderRadius: '9999px', // Rounded full
        padding: '4px',
        borderColor: '#d1d5db', // Tailwind gray-300
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#fb923c', // Tailwind orange-500
        },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menu: (provided: any) => ({
        ...provided,
        borderRadius: '0.5rem', // Tailwind rounded-lg
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (provided: any, state: { isFocused: any; }) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: state.isFocused ? '#fb923c' : 'white', // Tailwind orange-500 for focused state
        color: state.isFocused ? 'white' : 'black',
        '&:active': {
            backgroundColor: '#fb923c',
            color: 'white',
        },
    }),
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
        cost: initialProduct.cost, // Added cost to formData
        dishType: initialProduct.dishType,
        quantity: initialProduct.quantity,
        imageUrl: initialProduct.imageUrl,
        category: initialProduct.category
    });
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/my/categories');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setCategories(response.data.map((category: { _id: any; title: any; imageUrl: any }) => ({ value: category._id, label: category.title })));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const dishTypes = [
        { value: '', label: 'Select Dish Type' },
        { value: 'main', label: 'Main' },
        { value: 'side', label: 'Side' },
        { value: 'beverage', label: 'Beverage' },
        { value: 'entry', label: 'Entry' },
        { value: 'dessert', label: 'Dessert' },
    ];

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        // Additional actions based on selected category can be added here
    };

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
    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            category: selectedCategory
        }));
    }, [selectedCategory]);
    
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
                        <span className="text-xl font-bold text-gray-900">{product.price} dt</span>
                    </div>
                    <p className="mt-4 text-gray-600">  <HTMLContent content={product.description} /> </p>
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
                        <form onSubmit={handleUpdateSubmit} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Cost</label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Dish Type</label>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="dishType">Dish Type</InputLabel>
                                        <Select
                                            id="dishType"
                                            name="dishType"
                                            value={formData.dishType}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        >
                                            {dishTypes.map(type => (
                                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Category</label>
                                    <Select
                                                        labelId="category-label"
                                                        id="category"
                                                        value={selectedCategory}
                                                        onChange={handleCategoryChange}
                                                        label="Category"
                                                    >
                                                        {categories.map((category) => (
                                                            <MenuItem key={category.value} value={category.value}>
                                                                {category.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button type="submit" className="bg-gray-800 text-black rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                    <i className="fa fa-save"></i>
                                </button>
                            </div>
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
