import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import Discount from '../../src/models/Discount';
import Restaurant from '../../src/models/Restaurant';
import discountRoutes from '../../src/routes/DiscountRoute'; // Adjust the path as necessary

const app = express();
app.use(bodyParser.json());
app.use('/api/my/discounts', discountRoutes);

beforeEach(async () => {
  await mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Seed the database with test data
  const restaurant = new Restaurant({
    restaurantName: 'Test Restaurant'
  });
  await restaurant.save();

  await Discount.create([
    {
      couponCode: 'DISCOUNT11',
      discount: 0.1,
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      restaurantName: restaurant._id // Use the actual restaurant ID
    },
    {
      couponCode: 'DISCOUNT23',
      discount: 0.2,
      expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      restaurantName: restaurant._id // Ensure this is set
    },
    {
      couponCode: 'DISCOUNT30',
      discount: 0.3,
      expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      restaurantName: restaurant._id // Ensure this is set
    },
  ]);
});

afterEach(async () => {
//   await mongoose.connection.db.dropDatabase();
//   await mongoose.connection.close();
});

describe('Discount Controller', () => {
  test('should add a new coupon', async () => {
    const response = await request(app)
      .post('/api/my/discounts/add-coupon')
      .send({
        couponCode: 'DISCOUNT39',
        discount: 0.2,
        expirationDate: new Date(Date.now() + 100000),
        restaurantName: 'Test Restaurant' // Ensure the restaurant name is included
      });

    expect(response.status).toBe(201);
    expect(response.body.coupon).toHaveProperty('couponCode', 'DISCOUNT39');
  }, 10000);
//   test('should validate a coupon code', async () => {
//     const response = await request(app)
//       .post('/api/my/discounts/validate-coupon')
//       .send({ couponCode: 'DISCOUNT11' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('discount', 0.1);
//   }, 10000);

//   test('should fail to validate an expired coupon code', async () => {
//     const response = await request(app)
//       .post('/api/my/discounts/validate-coupon')
//       .send({ couponCode: 'DISCOUNT23' });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('message', 'Coupon code has expired');
//   }, 10000);

//   test('should get coupons by restaurant name', async () => {
//     const restaurant = new Restaurant({
//         restaurantName: 'Test Restaurant'
//       });
//     const response = await request(app)
//       .get(`/api/my/discounts/get-coupons?restaurantName=${restaurant._id}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(expect.arrayContaining([
//       expect.objectContaining({ couponCode: 'DISCOUNT11' })
//     ]));
//   }, 10000);
});
