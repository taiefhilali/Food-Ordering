import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

type Coupon = {
    couponCode: string;
    discount: number;
    expirationDate: string;
};

const CouponList = ({ restaurantName }: { restaurantName: string }) => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/my/discounts/by-restaurant', {
                    params: { restaurantName }
                });
                setCoupons(response.data.coupons);
            } catch (err) {
                setError('Failed to fetch coupons');
                console.error(err);
            }
        };

        if (restaurantName) {
            fetchCoupons();
        }
    }, [restaurantName]);

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
        });
    }

    return (
        <Container>
            <Row>
                {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <Col key={coupon.couponCode} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{coupon.couponCode}</Card.Title>
                                    <Card.Text>
                                        Discount: {coupon.discount}%
                                    </Card.Text>
                                    <Card.Text>
                                        Expiration Date: {new Date(coupon.expirationDate).toLocaleDateString()}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No coupons available</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default CouponList;
