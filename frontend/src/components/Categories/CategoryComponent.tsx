import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import './catrgory.css';

// Define the 'Categorie' interface
interface Categorie {
    _id: string;
    title: string;
    value: string;
    imageUrl: string;
}

const CategoryComponent: React.FC = () => {
    // State variable to store category data
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Function to fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/my/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Function to handle form submission for creating a new category
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:7000/api/my/categories', { title, value, imageUrl });
            // Refetch categories to update the list
            fetchCategories();
            // Reset form inputs
            setTitle('');
            setValue('');
            setImageUrl('');
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    // Function to handle deletion of a category
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:7000/api/my/categories/${id}`);
            // Refetch categories to update the list
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Fetch categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Categories" />
            <div className="category-container">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="category-row">
                                <td>{category.title}</td>
                                <td>{category.value}</td>
                                <td>
                                    <button onClick={() => handleDelete(category._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="card category-card">
    <div className="card-body">
        <h2>Create New Category</h2>
        <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="value">Value:</label>
                <input
                    type="text"
                    id="value"
                    className="form-control"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            {/* <div className="form-group">
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                    type="text"
                    id="imageUrl"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div> */}
            <button className="btn btn-primary" type="submit">Create Category</button>
        </form>
    </div>
</div>

            </div>
            
        </DefaultLayout>
    );
};

export default CategoryComponent;
