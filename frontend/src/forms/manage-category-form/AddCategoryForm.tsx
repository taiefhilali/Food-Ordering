// AddCategoryForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
interface AddCategoryFormProps {
    fetchCategories: () => void; // Function to refetch categories after adding
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ fetchCategories }) => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:7000/api/my/categories', { title, value });
            fetchCategories(); // Update categories list
            setTitle(''); // Clear form inputs
            setValue('');
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    return (
        <DefaultLayout>
         <Breadcrumb pageName="Manage Categories" />

         <div className="category-container">

                <div className="col-span-5 xl:col-span-3">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Create New Category
                            </h3>
                        </div>
                        <div className="p-7">
                            <form onSubmit={handleSubmit} className="category-form">
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="title"
                                    >
                                        Title
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        id="title"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="value"
                                    >
                                        Value
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        id="value"
                                        placeholder="Enter value"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-4.5">
                                    <button
                                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="button"
                                        onClick={() => {
                                            setTitle('');
                                            setValue('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
       
        </DefaultLayout>
    );
};

export default AddCategoryForm;
