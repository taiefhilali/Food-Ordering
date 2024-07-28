// import express from 'express';
// import bodyParser from 'body-parser';
// import request from 'supertest';
// import sinon from 'sinon';
// import authController from '../controllers/authController';
// import User from '../models/User';
// import passport from 'passport';
// import { describe, beforeEach, afterEach, test, expect,it } from '@jest/globals';
// import authRoutes from '../../src/routes/authRoute'; // Adjust path if necessary
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTY1OTBmNDAxODI4YjQxMWMyNDJhOCIsInVzZXJUeXBlIjoiQWRtaW4iLCJlbWFpbCI6ImJvYnRhaWVmQGdtYWlsLmNvbSIsImlhdCI6MTcyMjE3NzgzNSwiZXhwIjoxNzI2NDk3ODM1fQ.NPu7UWwOoP8HBHh-szN9f_a3-OxCI9SgVY9MV-ZJsvA'; // Replace with your actual static token
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// // Set up the Express app and routes for testing
// const app = express();
// app.use(bodyParser.json());
// app.use('/api/my/auth', authRoutes);

// // Mock passport functions
// const passportAuthenticate = sinon.stub(passport, 'authenticate');
// passportAuthenticate.callsFake((strategy: string, options: any) => (req: any, res: any, next: any) => next());

// // Test cases
// describe('Authentication Controller', () => {

//     it('should have at least one test', () => {
//       expect(true).toBe(true);
//     });
//   });
//     let sandbox: sinon.SinonSandbox;

//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//         sandbox.stub(bcrypt, 'compare').resolves(true); // Stub bcrypt.compare to always return true
//         sandbox.stub(jwt, 'sign').callsFake(() => 'mockToken'); // Correctly stub jwt.sign to return a mock token
//       });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     test('createUser should handle errors correctly', async () => {
//         const user = {
//             email: 'test@example.com',
//             username: 'testuser',
//             password: 'password123',
//         };

//         // Mocking the error scenario by forcing a failure in the route handler
//         sandbox.stub(User.prototype, 'save').throws(new Error('Database error'));

//         const response = await request(app)
//             .post('/api/my/auth/register') // Ensure this path matches the actual route
//             .send(user);

//         expect(response.status).toBe(500);
//         expect(response.body).toHaveProperty('error', 'Unknown error occurred');
//         expect(response.body).toHaveProperty('status', false);
//     });
    
  

//     test('loginUser should return a JWT token on successful login', async () => {
//       const user = {
//         email: 'test@example.com',
//         password: 'testuser',
//       };
  
//       // Hash the password for comparison
//       const hashedPassword = await bcrypt.hash(user.password, 10);
  
//       // Mocking User model methods
//       const mockUser = {
//         _id: 'userId',
//         email: user.email,
//         password: hashedPassword, // Use hashed password
//         userType: 'Client',
//         save: sinon.stub().resolves()
//       };
  
//       sandbox.stub(User, 'findOne').resolves(mockUser as any);
  
//       const response = await request(app)
//         .post('/api/my/auth/log') // Ensure this matches the actual endpoint
//         .send(user);
  
//       console.log('Response status:', response.status); // Log the response status for debugging
//       console.log('Response body:', response.body); // Log the response body for debugging
  
//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('userToken', 'mockToken');
//     });
  
  
  
//     test('forgotPassword should send a reset token email', async () => {
//         const user = { email: 'test@example.com' };

//         // Mocking User model methods
//         const mockUser = {
//             email: user.email
//         };

//         sandbox.stub(User, 'findOne').resolves(mockUser as any);

//         const response = await request(app)
//             .post('/api/my/auth/forgot-password')
//             .set('Authorization', `Bearer ${token}`)
//             .send(user);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('resetToken');
//     });

//     test('resetPassword should update the user password', async () => {
//         const user = {
//             email: 'test@example.com',
//             token: 'resetToken',
//             newPassword: 'newPassword123',
//         };

//         // Mocking User model methods
//         const mockUser = {
//             email: user.email,
//             password: 'hashedOldPassword',
//             save: sinon.stub().resolves()
//         };

//         sandbox.stub(User, 'findOne').resolves(mockUser as any);

//         const response = await request(app)
//             .post('/api/my/auth/reset-password')
//             .set('Authorization', `Bearer ${token}`)
//             .send(user);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message', 'Password updated successfully');
//     });

//     // Additional tests for other routes can be added here
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import authController from '../controllers/authController';
import User from '../models/User';
import passport from 'passport';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import authRoutes from '../../src/routes/authRoute'; // Adjust path if necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/my/auth', authRoutes);

// Mock passport functions
const passportAuthenticate = sinon.stub(passport, 'authenticate');
passportAuthenticate.callsFake((strategy: string, options: any) => (req: any, res: any, next: any) => next());

describe('Authentication Controller', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(bcrypt, 'compare').resolves(true); // Stub bcrypt.compare to always return true
        sandbox.stub(jwt, 'sign').callsFake(() => 'mockToken'); // Correctly stub jwt.sign to return a mock token
    });

    afterEach(() => {
        sandbox.restore();
    });

    test('createUser should handle errors correctly', async () => {
        const user = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        // Mocking the error scenario by forcing a failure in the route handler
        sandbox.stub(User.prototype, 'save').throws(new Error('Database error'));

        const response = await request(app)
            .post('/api/my/auth/register') // Ensure this path matches the actual route
            .send(user);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Unknown error occurred');
        expect(response.body).toHaveProperty('status', false);
    });

    test('loginUser should return a JWT token on successful login', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
        };

        // Hash the password for comparison
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Mocking User model methods
        const mockUser = {
            _id: 'userId',
            email: user.email,
            password: hashedPassword, // Use hashed password
            userType: 'Client',
            toObject: function() { return this; }, // Ensure toObject method returns the user object
        };

        sandbox.stub(User, 'findOne').resolves(mockUser as any);

        const response = await request(app)
            .post('/api/my/auth/log') // Ensure this matches the actual endpoint
            .send(user);

        console.log('Response status:', response.status); // Log the response status for debugging
        console.log('Response body:', response.body); // Log the response body for debugging

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userToken', 'mockToken');
    });

    test('forgotPassword should send a reset token email', async () => {
        const user = { email: 'test@example.com' };

        // Mocking User model methods
        const mockUser = {
            email: user.email
        };

        sandbox.stub(User, 'findOne').resolves(mockUser as any);

        const response = await request(app)
            .post('/api/my/auth/forgot-password')
            .send(user);

        console.log('Response status:', response.status); // Log the response status for debugging
        console.log('Response body:', response.body); // Log the response body for debugging

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('resetToken');
    });

    test('resetPassword should update the user password', async () => {
        const user = {
            email: 'test@example.com',
            token: 'resetToken',
            newPassword: 'newPassword123',
        };

        // Mocking User model methods
        const mockUser = {
            email: user.email,
            password: 'hashedOldPassword',
            save: sinon.stub().resolves()
        };

        sandbox.stub(User, 'findOne').resolves(mockUser as any);

        const response = await request(app)
            .post('/api/my/auth/reset-password')
            .send(user);

        console.log('Response status:', response.status); // Log the response status for debugging
        console.log('Response body:', response.body); // Log the response body for debugging

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Password updated successfully');
    });
});

