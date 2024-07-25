import request from 'supertest';
import sinon from 'sinon';
import cloudinary from 'cloudinary';
import express from 'express';
import bodyParser from 'body-parser';
import Restaurant from '../models/Restaurant';
import restaurantController from './../controllers/MyRestaurantController'; // Adjust path if necessary
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import multer from 'multer';
import myRestaurantRoute from './../routes/MyRestaurantRoute'; // Ensure this path is correct
// Set up the Express app and routes for testing

const app = express();
app.use(bodyParser.json());
// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });
app.use('/api/my/restaurant', upload.single('imageFile'), myRestaurantRoute);

// Use the Multer middleware in your routes that handle file uploads
// Example route setup if you want to define them directly without using a router
// Ensure to use the same middleware configuration for file uploads if required
app.post('/api/my/restaurant', upload.single('imageFile'), restaurantController.createMyRestaurant);
app.get('/api/my/restaurant', restaurantController.getMyRestaurant);
app.get('/api/my/restaurant/allmyrestaurants',  restaurantController.getAllRestaurantbyUser);
app.get('/api/my/restaurant/restaurants', restaurantController.getAllRestaurant);
app.put('/api/my/restaurant',  restaurantController.updateMyRestaurant);
app.get('/api/my/restaurant/:restaurantName', restaurantController.getRestaurantbyName);
app.post('/api/my/restaurant/like/:restaurantId', restaurantController.LikeRestaurant);
app.patch('/api/my/restaurant/:id/toggle-approval', restaurantController.toggleRestaurantApproval);
app.get('/api/my/restaurant/:id', restaurantController.getCuisinesStat);

describe('Restaurant Controller', () => {
    let sandbox: sinon.SinonSandbox;
    let cloudinaryUploadStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        cloudinaryUploadStub = sandbox.stub(cloudinary.v2.uploader, 'upload');
    });

    afterEach(() => {
        sandbox.restore();
    });

//     test('createMyRestaurant should handle errors correctly', async () => {
//        // Stub the Restaurant model's save method to reject with an error
//        sandbox.stub(Restaurant.prototype, 'save').rejects(new Error('Save failed'));

//        // Stub cloudinary upload function to reject with an error
//        cloudinaryUploadStub.rejects(new Error('Upload failed'));

//        const response = await request(app)
//            .post('/api/my/restaurant')
//            .field('userId', '669926cd6c30fb153dafafbb')
//            .field('restaurantName', 'Test Restaurant')
//            .field('estimatedDeliveryTime', '30 mins')
//            .field('cuisines', JSON.stringify(['Italian']))
//            .field('menuItems', JSON.stringify([]))
//            .attach('file', Buffer.from('test'), 'test.jpg');

//        console.log('Response body:', response.body); // Log the response body for debugging

//        expect(response.status).toBe(500);
//        expect(response.body).toHaveProperty('message', 'Error creating restaurant');
//    });


    // test('updateMyRestaurant should update an existing restaurant and return the updated details', async () => {
    //     const mockImageUrl = 'http://example.com/image.jpg';
    //     const mockRestaurant = {
    //         user: 'userId',
    //         restaurantName: 'Updated Restaurant',
    //         estimatedDeliveryTime: '40 mins',
    //         cuisines: ['Chinese'],
    //         menuItems: [],
    //         imageUrl: mockImageUrl,
    //         lastUpdated: new Date(),
    //     };

    //     sandbox.stub(Restaurant, 'findOneAndUpdate').resolves(mockRestaurant as any);
    //     cloudinaryUploadStub.resolves({ url: mockImageUrl });

    //     const response = await request(app)
    //         .put('/updateRestaurant')
    //         .field('userId', 'userId')
    //         .field('restaurantName', 'Updated Restaurant')
    //         .field('estimatedDeliveryTime', '40 mins')
    //         .field('cuisines', JSON.stringify(['Chinese']))
    //         .field('menuItems', JSON.stringify([]))
    //         .attach('file', Buffer.from('test'), 'test.jpg');

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Restaurant Updated');
    // });
    test('LikeRestaurant should toggle like status of a restaurant', async () => {
        const mockRestaurant = {
            _id: 'restaurantId',
            likes: [],
            save: sinon.stub().resolves()
        };
    
        sandbox.stub(Restaurant, 'findById').resolves(mockRestaurant as any);
    
        const response = await request(app)
            .post('/api/my/restaurant/like/restaurantId') // Correct route
            .send({ userId: 'userId' });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Like status updated');
    });
    
    // test('getMyRestaurant should return restaurants for the logged-in user', async () => {
    //     const mockRestaurants = [
    //         { restaurantName: 'Restaurant 1' },
    //         { restaurantName: 'Restaurant 2' }
    //     ];
    
    //     sandbox.stub(Restaurant, 'find').resolves(mockRestaurants as any);
    
    //     const response = await request(app).get('/api/my/restaurant/allmyrestaurants').send({ userId: 'userId' });
    
    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveLength(2);
    // });

    test('getRestaurantbyName should return a restaurant by name', async () => {
        const mockRestaurant = { restaurantName: 'Test Restaurant' };
    
        sandbox.stub(Restaurant, 'findOne').resolves(mockRestaurant as any);
    
        const response = await request(app).get('/api/my/restaurant/restaurantName');
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('restaurantName', 'Test Restaurant');
    });
});