import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './categoriesTable.css'
interface Category {
    _id: string;
    title: string;
    value: string;
    imageUrl: string; // Add imageUrl to the Category interface
}

interface DisplayCategoriesProps {
    categories: Category[];
    // Function to refetch categories after deletion
}

const DisplayCategories: React.FC<DisplayCategoriesProps> = () => {
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
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                      });
                    }
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
        <div className="max-w-full mx-auto mt-10">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Category Image</th>
                        <th>Title</th>
                        <th>Value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>
                                <div className="product-image-container">
                                    <img
                                        src={category.imageUrl} // Display category image
                                        alt={category.title}
                                        className="product-image"
                                    />
                                </div>
                            </td>
                            <td>{category.title}</td>
                            <td>{category.value}</td>
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
