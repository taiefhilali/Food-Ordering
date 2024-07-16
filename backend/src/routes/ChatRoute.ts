// routes/messages.ts

import express from 'express';

const router = express.Router();
import { FetchMessages,saveMessage,fetchUsersByUserType,fetchSenders } from '../controllers/ChatController'; // Adjust the path based on your project structure

// Define your route for fetching messages
router.get('/all', FetchMessages);
router.post('/new', saveMessage);
router.get('/clients', fetchUsersByUserType);
router.get('/fetch-senders', fetchSenders);

export default router;
