// DisplayCategories.tsx
import React from 'react';
import axios from 'axios';

interface Category {
    _id: string;
    title: string;
    value: string;
}

interface DisplayCategoriesProps {
    categories: Category[];
    fetchCategories: () => void; // Function to refetch categories after deletion
}

const DisplayCategories: React.FC<DisplayCategoriesProps> = ({ categories, fetchCategories }) => {
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:7000/api/my/categories/${id}`);
            fetchCategories(); // Update categories list
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
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
                            <button onClick={() => handleDelete(category._id)}>X</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DisplayCategories;
