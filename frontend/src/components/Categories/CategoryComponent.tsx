
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DisplayCategories from '../../pages/Categories/DisplayCategories';
import './catrgory.css';

interface Categorie {
    _id: string;
    title: string;
    value: string;
    imageUrl: string;
}

const CategoryComponent: React.FC = () => {
    const [categories, setCategories] = useState<Categorie[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/my/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Categories" />
            <div className="category-container">
                <DisplayCategories categories={categories} fetchCategories={fetchCategories} />
                {/* <AddCategoryForm fetchCategories={fetchCategories} /> */}
            </div>
        </DefaultLayout>
    );
};

export default CategoryComponent;
