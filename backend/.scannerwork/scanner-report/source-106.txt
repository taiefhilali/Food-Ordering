// import request from 'supertest';
// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import * as productController from '../../src/controllers/MyProductController';
// import Product from '../../src/models/Product';
// import User from '../models/User';
// import { beforeEach, afterEach, describe, test, expect, jest } from '@jest/globals';
// const { 
//   getAllProducts,
//   createMyProduct,
//   getProductById,
//   getProductBycategory,
//   updateProduct,
//   deleteProduct,
//   quantityProduct,
//   uploadimage,
//   toggleProductApproval,
//   productsByUserId,
//   productsByRestaurantId,
//   searchProductByName,
//   sellProduct,
//   calculateRestaurantRevenue,
//   revenuStatistics,
//   LikeProduct
// } = require('../../src/controllers/MyProductController');
// // Set up the Express app and routes for testing
// const app = express();
// app.use(bodyParser.json());
// app.get('/api/my/products', getAllProducts);
// app.post('/api/my/products', createMyProduct);
// app.get('/api/my/products/:id', getProductById);
// app.put('/api/my/products/:id', updateProduct);
// app.delete('/api/my/products/:id', deleteProduct);
// app.get('/api/my/products/category/:categoryId',getProductBycategory);
// app.post('/api/my/products/sell', sellProduct);
// app.get('/api/my/products/quantity',quantityProduct);
// app.patch('/api/my/products/:id/toggle-approval', toggleProductApproval);
// app.get('/api/my/products/restaurant/:restaurantId',productsByRestaurantId);
// app.get('/api/my/products/revenue/:date', revenuStatistics);
// app.post('/api/my/products/like/:productId', LikeProduct);
// app.get('/api/my/products/search', searchProductByName);

// describe('Product Controller', () => {
//   beforeEach(async () => {
//     await mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
//     }).then(() => console.log('MongoDB connected'))
//       .catch(err => console.error('MongoDB connection error:', err));

//        // Seed the database with test data
//     await Product.create([
//       { 
//         name: 'Product 1', 
//         price: 10, 
//         category: '66a632ddecfd0ae2c2df8d17', // Updated category ObjectId
//         quantity: 100, 
//         restaurant: '66a632bcecfd0ae2c2df8d00', // Updated restaurant ObjectId
//         dishType: 'main' 
//       },
//       { 
//         name: 'Product 2', 
//         price: 20, 
//         category: '66a632ddecfd0ae2c2df8d17', // Updated category ObjectId
//         quantity: 200, 
//         restaurant: '66a632bcecfd0ae2c2df8d00', // Updated restaurant ObjectId
//         dishType: 'main' 
//       }
//   ]);
// }, 10000);

// afterEach(async () => {
//   // const collections = await mongoose.connection.db.collections();
//   // for (let collection of collections) {
//   //     await collection.deleteMany({});
//   // }
//   // await mongoose.connection.close();
// }, 10000);

//   test('should get all products', async () => {
//       const response = await request(app).get('/api/my/products');
//       expect(response.status).toBe(200);
//       expect(response.body).toBeInstanceOf(Array);
//   }, 10000);

//     // test('should create a new product', async () => {
//     //     // Assuming you have a user and a restaurant created for the product
//     //     const user = new User({
//     //       username: `user_${Date.now()}`,
//     //       password: 'password',
//     //       email: `user_${Date.now()}@gmail.com`
//     //   });
//     //   await user.save();
  
//     //   const newProduct = {
//     //       name: 'Test Product',
//     //       price: 10,
//     //       dishType: 'main',
//     //       restaurant: new mongoose.Types.ObjectId('667a48e1b4d43cefbb966ab2'),
//     //       quantity: 100,
//     //       user: user._id,
//     //       category: new mongoose.Types.ObjectId('66a56ac8b4b88056a150591c'),
//     //   };

//     //     const response = await request(app)
//     //         .post('/api/my/products')
//     //         .send(newProduct);

//     //     expect(response.status).toBe(201);
//     //     expect(response.body).toHaveProperty('message', 'Product created successfully');
//     //     expect(response.body.product).toHaveProperty('name', newProduct.name);
//     // }, 10000);

//     test('should get a product by ID', async () => {
//         const product = new Product({
//             name: 'Test Product',
//             price: 10,
//             dishType: 'main',
//             restaurant: new mongoose.Types.ObjectId(),
//             quantity: 100,
//             user: new mongoose.Types.ObjectId(),
//             category: new mongoose.Types.ObjectId(),
//         });
//         await product.save();

//         const response = await request(app).get(`/api/my/products/${product._id}`);
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('name', product.name);
//     }, 10000);

//     test('should update a product by ID', async () => {
//         const product = new Product({
//             name: 'Test Product',
//             price: 10,
//             dishType: 'main',
//             restaurant: new mongoose.Types.ObjectId(),
//             quantity: 100,
//             user: new mongoose.Types.ObjectId(),
//             category: new mongoose.Types.ObjectId(),
//         });
//         await product.save();

//         const updatedData = { name: 'Updated Product Name' };
//         const response = await request(app).put(`/api/my/products/${product._id}`).send(updatedData);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('name', updatedData.name);
//     }, 10000);
//     test('should delete a product by ID', async () => {
//         const product = new Product({
//             name: 'Test Product',
//             price: 10,
//             dishType: 'main',
//             restaurant: new mongoose.Types.ObjectId(),
//             quantity: 100,
//             user: new mongoose.Types.ObjectId(),
//             category: new mongoose.Types.ObjectId(),
//         });
//         await product.save();

//         const response = await request(app).delete(`/api/my/products/${product._id}`);
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message', 'Product deleted successfully');
//     }, 10000);

//     // Add more tests for the remaining routes and functionalities as needed

//     test('should like a product', async () => {
//         const user = new User({ username: 'testuser', password: 'password' , email:'testuser@gmail.com', googleId: 'unique-google-id-1' ,facebookId: 'unique-facebook-id-1'// Provide a unique googleId
//         });
//         await user.save();

//         const product = new Product({
//             name: 'Test Product',
//             price: 10,
//             dishType: 'main',
//             restaurant: new mongoose.Types.ObjectId(),
//             quantity: 100,
//             user: new mongoose.Types.ObjectId(),
//             category: new mongoose.Types.ObjectId(),
//         });
//         await product.save();

//         const response = await request(app)
//             .post(`/api/my/products/like/${product._id}`)
//             .send({ userId: user._id });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message', 'Like status updated');
//     }, 10000);

//     // Continue adding tests for other functionalities like sellProduct, calculateRestaurantRevenue, etc.
// });
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
        category: new mongoose.Types.ObjectId(),
        quantity: 100, 
        restaurant: new mongoose.Types.ObjectId(), 
        dishType: 'main' 
      },
      { 
        name: 'Product 2', 
        price: 20, 
        category: new mongoose.Types.ObjectId(), 
        quantity: 200, 
        restaurant: new mongoose.Types.ObjectId(), 
        dishType: 'main' 
      }
    ]);
  }, 10000);

  afterEach(async () => {
    // await mongoose.connection.dropDatabase();
    // await mongoose.connection.close();
  }, 10000);
  afterAll(async () => {
    await mongoose.connection.close();
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
