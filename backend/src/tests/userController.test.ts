import request from 'supertest';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import User from '../models/User';
import userController from './../controllers/MyUserController';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';

// Set up the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.get('/user/:id', userController.getUser);
app.delete('/user/:id', userController.deleteUser);
app.put('/user/:id', userController.updateUser);
app.post('/uploadProfilePicture/:userId', userController.uploadProfilePicture);
app.get('/users', userController.getAllUsers);
app.post('/blockUser/:id', userController.blockUser);

describe('User Controller', () => {
    let sandbox: sinon.SinonSandbox;
    let nodemailerSendMailStub: sinon.SinonStub;
    let cloudinaryUploadStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        //nodemailerSendMailStub = sandbox.stub(nodemailer.createTransport().sendMail);
        cloudinaryUploadStub = sandbox.stub(cloudinary.v2.uploader, 'upload');
    });

    afterEach(() => {
        sandbox.restore();
    });

    // test('registerUser should register a new user and send verification email', async () => {
    //     // Mock the User model
    //     const saveStub = sandbox.stub(User.prototype, 'save').resolves();

    //     // Mock external dependencies
    //     nodemailerSendMailStub.resolves();
    //     cloudinaryUploadStub.resolves({ url: 'http://example.com/image.jpg' });

    //     const response = await request(app)
    //         .post('/register')
    //         .send({
    //             username: 'testuser',
    //             email: 'test@example.com',
    //             firstname: 'Test',
    //             lastname: 'User',
    //             password: 'password123',
    //             userType: 'client'
    //         });

    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty('username', 'testuser');
    //     sinon.assert.calledOnce(nodemailerSendMailStub);
    // });

    test('loginUser should log in a user with valid credentials', async () => {
        sandbox.stub(User, 'findOne').resolves({
            password: await bcrypt.hash('password123', 10),
            toObject: () => ({ email: 'test@example.com' })
        } as any);

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    test('getUser should return user details by ID', async () => {
        sandbox.stub(User, 'findById').resolves({
            email: 'test@example.com',
            firstname: 'Test',
            lastname: 'User'
        } as any);

        const response = await request(app).get('/user/123');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    test('deleteUser should delete a user by ID', async () => {
        sandbox.stub(User, 'findByIdAndDelete').resolves();

        const response = await request(app).delete('/user/123');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', true);
    });

    test('updateUser should update user details by ID', async () => {
        sandbox.stub(User, 'findByIdAndUpdate').resolves({
            toObject: () => ({ email: 'updated@example.com' })
        } as any);

        const response = await request(app)
            .put('/user/123')
            .send({ email: 'updated@example.com' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', true);
    });

    // test('uploadProfilePicture should upload a profile picture', async () => {
    //     sandbox.stub(User, 'findByIdAndUpdate').resolves({} as any);
    //     cloudinaryUploadStub.resolves({ secure_url: 'http://example.com/image.jpg' });

    //     const response = await request(app)
    //         .post('/uploadProfilePicture/123')
    //         .attach('file', Buffer.from('test'), 'test.jpg');

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('imageUrl', 'http://example.com/image.jpg');
    // });

    test('getAllUsers should return a list of all users', async () => {
        sandbox.stub(User, 'find').resolves([{ email: 'test1@example.com' }, { email: 'test2@example.com' }] as any);

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    test('blockUser should block a user by ID', async () => {
        sandbox.stub(User, 'findByIdAndUpdate').resolves({
            blocked: true,
            toObject: () => ({ blocked: true })
        } as any);

        const response = await request(app).post('/blockUser/123');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User blocked successfully');
    });
});
