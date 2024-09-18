/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

type Coupon = {
    couponCode: string;
    discount: number;
    expirationDate: string;
};

const StyledCard = styled(Card)(() => ({
    borderRadius: '20px',  // Rounded corners
    border: '1px solid #ddd',  // Border color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Shadow for depth
    backgroundColor: '#f9f9f9',  // Background color
    padding: '16px',
    maxWidth: '300px',
    margin: 'auto',
}));

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

    return (
        <Container>
            {error && (
                <Alert severity="error">{error}</Alert>
            )}
            <Grid container spacing={3}>
                {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <Grid item key={coupon.couponCode}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {coupon.couponCode}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Discount: {coupon.discount}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Expiration Date: {new Date(coupon.expirationDate).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary">
                            No coupons available
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default CouponList;
