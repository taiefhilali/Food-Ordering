import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Product } from '@/types/product';

const StockComponent = () => {
    const [productId, setProductId] = useState('');
    const [quantitySold, setQuantitySold] = useState('');
    const [sellMessage, setSellMessage] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        fetchProducts(); // Fetch products on component mount
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }
            const userId = localStorage.getItem('userId');
            const response = await axios.get('http://localhost:7000/api/my/products/all', {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Handle error as needed
        }
    };
    const handleSellProduct = async () => {
        try {
            const response = await axios.post('http://localhost:7000/api/my/products/sell', {
                productId,
                quantitySold: parseInt(quantitySold), // Ensure quantitySold is a number
            });
            setSellMessage(response.data.message);
        } catch (error) {
            console.error('Error selling product:', error);
            // Log the error response to get more details
            if (error.response) {
                console.error('Error response:', error.response.data);
                setSellMessage(`Failed to sell product: ${error.response.data.message}`);
            } else {
                setSellMessage('Failed to sell product: An unknown error occurred.');
            }
        }
    };

    return (
        <DefaultLayout>
        <div className="flex justify-center items-center h-full">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Sell Product</h2>
                <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                        <option key={product._id} value={product._id}>
                            {product.name}  {/* Adjust based on your product structure */}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Quantity Sold"
                    value={quantitySold}
                    onChange={(e) => setQuantitySold(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button
                    onClick={handleSellProduct}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    Sell Product
                </button>
                {sellMessage && <p className="mt-4 text-red-600">{sellMessage}</p>}
                <RevenueComponent />
            </div>
        </div>
    </DefaultLayout>
    );
};

type Restaurant = {
    _id: string;
    restaurantName: string;
};

const RevenueComponent = () => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const [revenue, setRevenue] = useState<number | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        // Fetch restaurants data
        const fetchRestaurants = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    throw new Error('No token found');
                }
                const userId = localStorage.getItem('userId');

                const response = await axios.get('http://localhost:7000/api/my/restaurant', {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                // Handle error as needed (e.g., show error message)
            }
        };

        fetchRestaurants();
    }, []);

    const handleCalculateRevenue: SubmitHandler<{ restaurant: string }> = async (data) => {
        const { restaurant } = data;
        try {
            const response = await axios.get(`http://localhost:7000/api/my/products/${restaurant}/revenue`);
            setRevenue(response.data.totalRevenue);
        } catch (error) {
            console.error('Error calculating restaurant revenue:', error);
        }
    };

    return (
        <div className="mt-8">
            <div className="max-w-md w-full  bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Calculate Restaurant Revenue</h2>
                <form onSubmit={handleSubmit(handleCalculateRevenue)}>
                    <select
                        {...register('restaurant', { required: true })}
                        className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        value={selectedRestaurantId}
                        onChange={(e) => setSelectedRestaurantId(e.target.value)}
                    >
                        <option value="">Select Restaurant</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                                {restaurant.restaurantName}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        Calculate Revenue
                    </button>
                </form>
                {revenue !== null && (
                    <p className="mt-4">Total Revenue for {selectedRestaurantId}: ${revenue}</p>
                )}
            </div>
        </div>
    );
};

export default StockComponent;

