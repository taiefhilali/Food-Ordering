import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Input from '../../components/Inputs/Input';
import Swal from 'sweetalert2';
import Lottie from 'react-lottie';
import categoryAnimationdata from '../../assets/category.json';

const CategoryAnimation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: categoryAnimationdata,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return <Lottie options={defaultOptions} height={100} width={100} />;
};
interface AddCategoryFormProps {
}
interface Category {
    _id: string;
    title: string;
    value: string;
    imageUrl: string;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = () => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            const userId = localStorage.getItem('userId');
            const response = await axios.get('http://localhost:7000/api/my/categories/all', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('value', value);
            if (imageFile) {
                formData.append('imageFile', imageFile);
            }
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            const userId = localStorage.getItem('userId');

            const response = await axios.post('http://localhost:7000/api/my/categories', formData, {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === true) {
                // Handle success with Swal
                Swal.fire({
                    icon: 'success',
                    title: 'Category Created!',
                    text: 'Your new category has been successfully created.',
                });

                // Update categories list and clear form inputs
                fetchCategories();
                setTitle('');
                setValue('');
                setImageFile(null);
            } else {
                throw new Error('Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);

            // Handle error with Swal
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create category. Please try again later.',
            });
        }
    };
    const handleDelete = async (categoryId: string) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.delete(`http://localhost:7000/api/my/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === true) {
                // Handle success with Swal
                Swal.fire({
                    icon: 'success',
                    title: 'Category Deleted!',
                    text: 'The category has been successfully deleted.',
                });

                // Update categories list
                fetchCategories();
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);

            // Handle error with Swal
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete category. Please try again later.',
            });
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Categories" />

            <div className="max-w-full mx-auto mt-20 flex justify-center">
                {/* Categories Display */}
                {/* <div className="grid grid-cols-6 gap-3"> */}
                <div className="flex flex-row items-start gap-4.5 w-1/4">
                    {categories.map((category) => (
                        <div key={category._id} className="flex flex-col items-center">
                            {/* <div
                                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center"
                                style={{ backgroundImage: `url(${category.imageUrl})`, backgroundSize: 'cover' }}
                            > */}
                                {/* Image or initial letter */}
                            {/* </div>
                            <p className="mt-2 text-center">{category.title}</p>*/}
                              <div key={category._id} className="flex flex-col items-center relative">
                            <button
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                onClick={() => handleDelete(category._id)}
                            >
                                X
                            </button>
                            <div
                                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center"
                                style={{ backgroundImage: `url(${category.imageUrl})`, backgroundSize: 'cover' }}
                            >
                                {/* Image or initial letter */}
                            </div>
                            <p className="mt-2 text-center">{category.title}</p>
                        </div>
                        </div> 
                    ))}
                </div>

                {/* Form to Add Category */}
                <div className="max-w-115 mx-auto bg-white shadow-switcher mb-15 rounded-lg p-9 flex-1 border-orange-500 border-opacity-45 border-2 mr-6">
                    <div className="p-7 flex justify-center items-center">
                        <form onSubmit={handleSubmit} className="category-form" encType="multipart/form-data">
                            <div className="mt-0">
                                <CategoryAnimation />
                            </div>
                            <div className="mb-5.5">
                                <Input
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-5.5">
                                <Input
                                    placeholder="Enter Value"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                            <div className="mb-5.5">
                                <Input
                                    type="file"
                                    id="imageFile"
                                    placeholder="Select your Category Image"
                                    // accept="image/*"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded-full items-center bg-orange-500 hover:bg-slate-400 py-2 px-10 font-medium text-gray hover:bg-opacity-90"
                                    type="submit"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AddCategoryForm;


