
import { v4 as uuidv4 } from 'uuid';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Product from '../../src/models/Product';
import User from '../../src/models/User';
import { beforeEach, afterEach, describe, test, expect,afterAll } from '@jest/globals';

// Import your controllers
const { 
  getAllProducts,
  createMyProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBycategory,
  toggleProductApproval,
  LikeProduct
} = require('../../src/controllers/MyProductController');

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.get('/api/my/products', getAllProducts);
app.post('/api/my/products', createMyProduct);
app.get('/api/my/products/:id', getProductById);
app.put('/api/my/products/:id', updateProduct);
app.delete('/api/my/products/:id', deleteProduct);
app.get('/api/my/products/category/:categoryId', getProductBycategory);
app.patch('/api/my/products/:id/toggle-approval', toggleProductApproval);
app.post('/api/my/products/like/:productId', LikeProduct);

describe('Product Controller', () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
    }).then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));
    // Seed the database with test data
    await Product.create([
      { 
        name: 'Product 1', 
        price: 10,
        cost:8,
        category: new mongoose.Types.ObjectId(),
        quantity: 100, 
        restaurant: new mongoose.Types.ObjectId(), 
        dishType: 'main' 
      },
      { 
        name: 'Product 2', 
        price: 20,
        cost:10, 
        category: new mongoose.Types.ObjectId(), 
        quantity: 200, 
        restaurant: new mongoose.Types.ObjectId(), 
        dishType: 'main' 
      }
    ]);
  }, 30000);

  afterEach(async () => {
    await Product.deleteMany({ name: { $in: ['Product 1', 'Product 2','Updated Product Name','Test Product'] } });
    await mongoose.connection.close();


  }, 30000);
  afterAll(async () => {
   
  });
  
  
  test('should get all products', async () => {
    const response = await request(app).get('/api/my/products');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  }, 10000);

  test('should get a product by ID', async () => {
    const product = new Product({
      name: 'Test Product',
      price: 10,
      cost:8,
      dishType: 'main',
      restaurant: new mongoose.Types.ObjectId(),
      quantity: 100,
      user: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
    });
    await product.save();

    const response = await request(app).get(`/api/my/products/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', product.name);
  }, 10000);

  test('should update a product by ID', async () => {
    const product = new Product({
      name: 'Test Product',
      price: 10,
      cost:8,
      dishType: 'main',
      restaurant: new mongoose.Types.ObjectId(),
      quantity: 100,
      user: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
    });
    await product.save();

    const updatedData = { name: 'Updated Product Name' };
    const response = await request(app).put(`/api/my/products/${product._id}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', updatedData.name);
  }, 10000);

  test('should delete a product by ID', async () => {
    const product = new Product({
      name: 'Test Product',
      price: 10,
      cost:8,
      dishType: 'main',
      restaurant: new mongoose.Types.ObjectId(),
      quantity: 100,
      user: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
    });
    await product.save();

    const response = await request(app).delete(`/api/my/products/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product deleted successfully');
  }, 10000);

  test('should like a product', async () => {
    const uniqueId = uuidv4();
    const user = new User({
      username: `testuser_${uniqueId}`,
      password: 'password',
      email: `testuser_${uniqueId}@gmail.com`,
      googleId: `unique-google-id-${uniqueId}`,
      facebookId: `unique-facebook-id-${uniqueId}`
    });
    await user.save();

    const product = new Product({
      name: 'Test Product',
      price: 10,
      cost:8,
      dishType: 'main',
      restaurant: new mongoose.Types.ObjectId(),
      quantity: 100,
      user: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
    });
    await product.save();

    const response = await request(app)
      .post(`/api/my/products/like/${product._id}`)
      .send({ userId: user._id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Like status updated');
  }, 10000);
});
