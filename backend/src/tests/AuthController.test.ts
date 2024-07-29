import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import sinon from 'sinon';
import authController from '../controllers/authController';
import User from '../models/User';
import passport from 'passport';
import { describe, beforeEach, afterEach, test, expect, beforeAll } from '@jest/globals';
import authRoutes from '../../src/routes/authRoute'; // Adjust path if necessary
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer'; // Import types
import { SinonStub } from 'sinon';
import { SentMessageInfo } from 'nodemailer'; // Import types

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/my/auth', authRoutes);

// Mock passport functions
const passportAuthenticate = sinon.stub(passport, 'authenticate');
passportAuthenticate.callsFake((strategy: string, options: any) => (req: any, res: any, next: any) => next());

const generateValidToken = (email: any) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET || 'defaultresetsecret',
    { expiresIn: '30m' }
  );
};

describe('Authentication Controller', () => {
    let sandbox: sinon.SinonSandbox;
    let token: string;

    beforeAll(() => {
        token = generateValidToken('test@example.com');
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(bcrypt, 'compare').resolves(true); // Stub bcrypt.compare to always return true
        sandbox.stub(jwt, 'sign').returns('mockToken' as any); // Correctly stub jwt.sign to return a mock token
        sandbox.stub(jwt, 'verify').returns({ email: 'test@example.com' } as any); // Stub jwt.verify to return a mock decoded token

        // Create the transport stub instance
        const transportStub = {
            sendMail: sinon.stub().resolves({ messageId: 'abc123' } as SentMessageInfo) // Correctly stub sendMail to return a mock SentMessageInfo
        };

        // Stub nodemailer.createTransport to return the transport stub
        sandbox.stub(nodemailer, 'createTransport').returns(transportStub as unknown as Transporter);
    });

    afterEach(() => {
        sandbox.restore();
    });

    // test('createUser should handle errors correctly', async () => {
    //     const user = {
    //         email: 'test@example.com',
    //         username: 'testuser',
    //         password: 'password123',
    //     };

    //     // Mocking the error scenario by forcing a failure in the route handler
    //     sandbox.stub(User.prototype, 'save').throws(new Error('Database error'));

    //     const response = await request(app)
    //         .post('/api/my/auth/register') // Ensure this path matches the actual route
    //         .send(user);

    //     expect(response.status).toBe(500);
    //     expect(response.body).toHaveProperty('error', 'Unknown error occurred');
    //     expect(response.body).toHaveProperty('status', false);
    // });

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

        if (response.status !== 200) {
            console.log('Failed to send reset token email:', response.body);
        }

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('resetToken');
    });

    test('resetPassword should update the user password', async () => {
        const user = {
            email: 'test@example.com',
            token: generateValidToken('test@example.com'), // Generate a valid token for the test
            newPassword: 'newPassword123',
        };
        const hashedPassword = await bcrypt.hash(user.newPassword, 10);
    
        // Mocking User model methods
        const mockUser = {
            email: user.email,
            password: hashedPassword,
            save: sinon.stub().resolves()
        };
    
        sandbox.stub(User, 'findOne').resolves(mockUser as any);
    
        const response = await request(app)
            .post('/api/my/auth/reset-password')
            .send(user);
    
        console.log('Response status:', response.status); // Log the response status for debugging
        console.log('Response body:', response.body); // Log the response body for debugging
    
        if (response.status !== 200) {
            console.log('Failed to reset password:', response.body);
        }
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Password reset successful'); // Update the expected message
    });
    
});
