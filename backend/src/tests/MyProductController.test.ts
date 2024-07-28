import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as productController from '../../src/controllers/MyProductController';
import Product from '../../src/models/Product';
import User from '../models/User';
import { beforeEach, afterEach, describe, test, expect, jest } from '@jest/globals';
const { 
  getAllProducts,
  createMyProduct,
  getProductById,
  getProductBycategory,
  updateProduct,
  deleteProduct,
  quantityProduct,
  uploadimage,
  toggleProductApproval,
  productsByUserId,
  productsByRestaurantId,
  searchProductByName,
  sellProduct,
  calculateRestaurantRevenue,
  revenuStatistics,
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
app.get('/api/my/products/category/:categoryId',getProductBycategory);
app.post('/api/my/products/sell', sellProduct);
app.get('/api/my/products/quantity',quantityProduct);
app.patch('/api/my/products/:id/toggle-approval', toggleProductApproval);
app.get('/api/my/products/restaurant/:restaurantId',productsByRestaurantId);
app.get('/api/my/products/revenue/:date', revenuStatistics);
app.post('/api/my/products/like/:productId', LikeProduct);
app.get('/api/my/products/search', searchProductByName);

describe('Product Controller', () => {
    beforeEach(async () => {
        // Set up database connection and other setup tasks
        await mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
        }).then(() => console.log('MongoDB connected'))
          .catch(err => console.error('MongoDB connection error:', err));
        // Optionally, you can create some mock data here
    });

    afterEach(async () => {
        // Clean up database and other teardown tasks
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    test('should get all products', async () => {
        const response = await request(app).get('/api/my/products');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('should create a new product', async () => {
        // Assuming you have a user and a restaurant created for the product
        const user = new User({ username: 'taiem2008', password: 'ghghgh' ,  email: 'bobtaiem@gmail.com'  // Include email
        });
        await user.save();

        const newProduct = {
            name: 'Test Product',
            price: 10,
            dishType: 'main',
            restaurant: new mongoose.Types.ObjectId('667a48e1b4d43cefbb966ab2'),
            quantity: 100,
            user:  new mongoose.Types.ObjectId('66789859995e5444eeff0dc5'),
            category: new mongoose.Types.ObjectId('66a56ac8b4b88056a150591c'),
        };

        const response = await request(app)
            .post('/api/my/products')
            .send(newProduct);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Product created successfully');
        expect(response.body.product).toHaveProperty('name', newProduct.name);
    });

    test('should get a product by ID', async () => {
        const product = new Product({
            name: 'Test Product',
            price: 10,
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
    });

    test('should update a product by ID', async () => {
        const product = new Product({
            name: 'Test Product',
            price: 10,
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
    });

    test('should delete a product by ID', async () => {
        const product = new Product({
            name: 'Test Product',
            price: 10,
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
    });

    // Add more tests for the remaining routes and functionalities as needed

    test('should like a product', async () => {
        const user = new User({ username: 'testuser', password: 'password' });
        await user.save();

        const product = new Product({
            name: 'Test Product',
            price: 10,
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
    });

    // Continue adding tests for other functionalities like sellProduct, calculateRestaurantRevenue, etc.
});
