import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './categoriesTable.css';


interface Category {
    _id: string;
    title: string;
    value: string;
    imageUrl: string;
}

interface DisplayCategoriesProps {
    categories: Category[];
    fetchCategories: () => Promise<void>;
}

const DisplayCategories: React.FC<DisplayCategoriesProps> = ({ categories, fetchCategories }) => {

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); 

    const handleDelete = async (categoryId: string) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#f2ab48",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`http://localhost:7000/api/my/categories/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status === true) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your category has been deleted.",
                        icon: "success"
                    });

                    // Update categories list
                    await fetchCategories();
                } else {
                    throw new Error('Failed to delete category');
                }
            }
        } catch (error) {
            console.error('Error deleting category:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete category. Please try again later.',
            });
        }
    };

    return (
            <div className="max-w-full mx-auto mt-10">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Category Image</th>
                            <th>Title</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>
                                    <div className="product-image-container">
                                        <img
                                            src={category.imageUrl}
                                            alt={category.title}
                                            className="product-image"
                                        />
                                    </div>
                                </td>
                                <td>{category.title}</td>
                                <td>
                                    <button onClick={() => handleDelete(category._id)}>X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    );
};

export default DisplayCategories;
