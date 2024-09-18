import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductDetailPage from '../../pages/Products/ProductDetailPage';
import '../../assets/css/ProductDetails.css'; // Import CSS file

// Product type definition
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    dishType: string;
    quantity: number;
    imageUrl: string;
    brand: string;
    cost: number;
    category: string; // Add category to match ProductDetailPage
};

const ProductDetailContainer = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(`http://localhost:7000/api/my/products/${productId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                console.log(response.data,"datadetails")
                
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProductById();
    }, [productId]);

    return product ? <ProductDetailPage product={product} /> : null;
};

export default ProductDetailContainer;
