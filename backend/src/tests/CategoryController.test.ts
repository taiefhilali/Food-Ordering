import request from 'supertest';
import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import sinon from 'sinon';
import cloudinary from 'cloudinary';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { UploadApiResponse } from 'cloudinary';

// Create an express app and set up the routes
const app = express();
app.use(express.json());

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mock middlewares for simplicity
app.use((req, res, next) => {
  (req as any).user = { id: '66775f1386c0da54a8cf6301' }; // Mock user object
  next();
});

// Mock Cloudinary upload function
const mockCloudinaryUpload = sinon.stub(cloudinary.v2.uploader, 'upload').resolves({
  url: 'http://mockimageurl.com'
} as Partial<UploadApiResponse> as UploadApiResponse);

// Route to create a new category
app.post('/api/my/categories', upload.single('imageFile'), async (req, res) => {
  try {
    const { title, value } = req.body;
    const uploadResponse = await cloudinary.v2.uploader.upload('dummyPath'); // Call the stubbed function
    const imageUrl = uploadResponse.url; // Access the URL from the response

    // Simulate saving the category to the database
    const newCategory = {
      _id: new mongoose.Types.ObjectId(),
      title,
      value,
      imageUrl,
      user: (req as any).user.id
    };

    res.status(201).json({
      status: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error creating Category' });
  }
});

describe('Category Controller', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    mockCloudinaryUpload.reset();
  });

  test('createCategory should create a new category and return it with a 201 status', async () => {
    const response = await request(app)
      .post('/api/my/categories')
      .set('Content-Type', 'multipart/form-data')
      .field('title', 'Test Category')
      .field('value', 'testvalue')
      .attach('imageFile', 'C:/Users/msi/Desktop/Food-Ordering/backend/public/1000-bninn.png'); // Use a local file for testing

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: true,
      message: 'Category created successfully',
      data: {
        title: 'Test Category',
        value: 'testvalue',
        imageUrl: 'http://mockimageurl.com',
        user: '66775f1386c0da54a8cf6301'
      }
    });
  });
});
