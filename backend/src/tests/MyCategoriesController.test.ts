import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import Category from '../../src/models/Category';
import categoryRoutes from '../routes/CategoriesRoute';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTY1OTBmNDAxODI4YjQxMWMyNDJhOCIsInVzZXJUeXBlIjoiQWRtaW4iLCJlbWFpbCI6ImJvYnRhaWVmQGdtYWlsLmNvbSIsImlhdCI6MTcyMjE3NzgzNSwiZXhwIjoxNzI2NDk3ODM1fQ.NPu7UWwOoP8HBHh-szN9f_a3-OxCI9SgVY9MV-ZJsvA'; // Replace with your actual static token

dotenv.config(); // Load environment variables

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/my/categories', categoryRoutes);

let validToken: string;

describe('Category Controller', () => {

  beforeEach(async () => {
    await mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
    }).then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));

    validToken = jwt.sign(
      { userId: '66a64436072193a1b143495c' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '365d' }
    );
  
    
    // Seed the database with test data
    await Category.create([
      { title: 'Category 1', value: 'category_1', user: new mongoose.Types.ObjectId() },
      { title: 'Category 2', value: 'category_2', user: new mongoose.Types.ObjectId() },
    ]);
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
   
    await Category.deleteMany({ title: { $in: ['Category 1', 'Category 2','Updated Category Title'] } });

    await mongoose.connection.close();}
  });

  test('should get all categories', async () => {
    const response = await request(app)
      .get('/api/my/categories')
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  }, 30000);



test('should update a category by ID', async () => {
    const category = new Category({
      title: 'Test Category',
      value: 'test_category',
      user: new mongoose.Types.ObjectId()
    });
    await category.save();
  
    const updatedData = { title: 'Updated Category Title' };
    const response = await request(app)
      .put(`/api/my/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Category updated successfully');
    expect(response.body).toHaveProperty('status', true);
  
    // Optionally fetch the category to verify the update
    const updatedCategory = await Category.findById(category._id);
    expect(updatedCategory).toHaveProperty('title', updatedData.title);
  }, 30000);
  


  test('should delete a category by ID', async () => {
    const category = new Category({
      title: 'Updated Category Title',
      value: 'test_category',
      user: new mongoose.Types.ObjectId()
    });
    await category.save();

    const response = await request(app)
      .delete(`/api/my/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Category successfully deleted');
  }, 30000);
// 
});