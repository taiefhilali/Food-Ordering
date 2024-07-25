import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import authController from '../controllers/authController';
import User from '../models/User';
import passport from 'passport';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import authRoutes from '../../src/routes/authRoute'; // Adjust path if necessary

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/my/auth', authRoutes);

// Mock passport functions
const passportAuthenticate = sinon.stub(passport, 'authenticate');
passportAuthenticate.callsFake((strategy: string, options: any) => (req: any, res: any, next: any) => next());

// Test cases
describe('Authentication Controller', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
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
    // test('loginUser should return a JWT token on successful login', async () => {
    //     const user = {
    //         email: 'bobtaief@gmail.com',
    //         password: 'ghghgh',
    //     };

    //     // Mocking User model methods
    //     const mockUser = {
    //         _id: 'userId',
    //         email: user.email,
    //         password: 'hashedPassword',
    //         userType: 'Client',
    //         save: sinon.stub().resolves()
    //     };

    //     sandbox.stub(User, 'findOne').resolves(mockUser as any);
       

    //     const response = await request(app)
    //         .post('/api/my/auth/login')
    //         .send(user);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('userToken', 'mockToken');
    // });

    // test('forgotPassword should send a reset token email', async () => {
    //     const user = { email: 'test@example.com' };

    //     // Mocking User model methods
    //     const mockUser = {
    //         email: user.email
    //     };

    //     sandbox.stub(User, 'findOne').resolves(mockUser as any);

    //     const response = await request(app)
    //         .post('/api/my/auth/forgot-password')
    //         .send(user);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('resetToken');
    // });

    // test('resetPassword should update the user password', async () => {
    //     const user = {
    //         email: 'test@example.com',
    //         token: 'resetToken',
    //         newPassword: 'newPassword123',
    //     };

    //     // Mocking User model methods
    //     const mockUser = {
    //         email: user.email,
    //         password: 'hashedOldPassword',
    //         save: sinon.stub().resolves()
    //     };

    //     sandbox.stub(User, 'findOne').resolves(mockUser as any);

    //     const response = await request(app)
    //         .post('/api/my/auth/reset-password')
    //         .send(user);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Password updated successfully');
    // });

    // Additional tests for other routes can be added here
});
