/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import CouponList from './CouponList'; // Adjust the path as necessary

type Restaurant = {
    _id: string;
    restaurantName: string;
    imageUrl: string;
};

const AddCouponCode = () => {
    const { control, handleSubmit, reset } = useForm();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [reloadCoupons, setReloadCoupons] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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
            }
        };

        fetchData();
    }, []);

    const onSubmit = async () => {
        if (!selectedRestaurant) {
            Swal.fire({
                icon: 'error',
                title: 'No restaurant selected',
                text: 'Please select a restaurant before adding a coupon.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post('http://localhost:7000/api/my/discounts/add-coupon', {
                couponCode,
                discount,
                expirationDate,
                restaurantName: selectedRestaurant?.restaurantName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Coupon code added successfully',
                text: response.data.message || 'The coupon code has been added.',
            });

            reset();
            setCouponCode('');
            setDiscount('');
            setExpirationDate('');
            setReloadCoupons(prev => !prev);  // Toggle the reloadCoupons state to trigger a refresh

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error adding coupon code',
                text: 'An unexpected error occurred.',
            });

            console.error('Error adding coupon code:', error);
        }
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderRadius: '9999px',
            padding: '4px',
            borderColor: '#d1d5db',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#fb923c',
            },
            width: '200%'
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        menu: (provided: any) => ({
            ...provided,
            borderRadius: '0.5rem',
        }),
        option: (provided: any, state: { isFocused: any; }) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: state.isFocused ? '#fb923c' : 'white',
            color: state.isFocused ? 'white' : 'black',
            '&:active': {
                backgroundColor: '#fb923c',
                color: 'white',
            },
        }),
    };

    const formatOptionLabel = ({ restaurantName, imageUrl }: Restaurant) => (
        <div className="flex justify-between items-center">
            <span>{restaurantName}</span>
            <img
                src={imageUrl}
                alt={restaurantName}
                className="w-8 h-8 rounded-full ml-2"
            />
        </div>
    );

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Discount Page' />
            <Container>
                <Row className="mt-5 mr-40 align-bottom">
                    <Col>
                        <Form className='mr-28' onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="restaurant"
                                rules={{ required: true }}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={restaurants}
                                        getOptionLabel={(restaurant) => restaurant.restaurantName}
                                        getOptionValue={(restaurant) => restaurant._id}
                                        formatOptionLabel={formatOptionLabel}
                                        styles={customStyles}
                                        placeholder="Select Restaurant"
                                        onChange={(selected) => {
                                            setSelectedRestaurant(selected);
                                            field.onChange(selected);
                                        }}
                                    />
                                )}
                            />
                            <Form.Group controlId="couponCode">
                                <Form.Label>Coupon Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    style={{ borderRadius: '50px', width: '200%' }}
                                />
                            </Form.Group>
                            <Form.Group controlId="discount">
                                <Form.Label>Discount</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter discount"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    style={{ borderRadius: '50px', width: '200%' }}
                                />
                            </Form.Group>
                            <Form.Group controlId="expirationDate">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Enter expiration date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    style={{ borderRadius: '50px', width: '200%' }}
                                />
                            </Form.Group>
                            <Row className="mt-5 justify-content-center">
                                <Button
                                    variant="warning"
                                    type="submit"
                                    style={{ backgroundColor: 'orange', borderColor: 'orange', borderRadius: '50px', width: '200%' }}
                                >
                                    Add Coupon Code
                                </Button>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                {selectedRestaurant && (
                    <Row className="mt-5">
                        <Col>
                            <CouponList restaurantName={selectedRestaurant.restaurantName} key={reloadCoupons.toString()} />
                        </Col>
                    </Row>
                )}
            </Container>
        </DefaultLayout>
    );
};

export default AddCouponCode;
