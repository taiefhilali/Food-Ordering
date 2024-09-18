import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCategoryForm from './AddCategoryForm';
import "./category.css";

const ManageCategoriesPage: React.FC = () => {
    const [, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            const userId = localStorage.getItem('userId');
            const response = await axios.get('http://localhost:7000/api/my/categories/all', {
                params: { userId },
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error('No token found');
            await axios.delete(`http://localhost:7000/api/my/categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <AddCategoryForm fetchCategories={fetchCategories} deleteCategory={deleteCategory} />
            <hr className="separator" /> {/* Separator line */}
           
        </div>
    );
};

interface Category {
    _id: string;
    title: string;
    value: string;
    imageUrl: string;
}

export default ManageCategoriesPage;
