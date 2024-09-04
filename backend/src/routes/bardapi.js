const express = require('express');
const router = express.Router();
const { DiscussServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');
const mongoose = require('mongoose');
const BotMessage = require('../models/BotMessage');  // Import the bot message model

const MODEL_NAME = 'models/chat-bison-001';
const API_KEY = process.env.BARD_API_KEY;

// Connect to MongoDB
mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

console.log('====================================');
console.log(MODEL_NAME);
console.log('====================================');

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

router.get('/generate-message', async (req, res) => {
  let messages = [{ content: req.query.ques }];

  try {
    const [result] = await client.generateMessage({
      model: MODEL_NAME,
      temperature: 0.25,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
      prompt: { messages: messages },
    });

    console.log('First Response:', result.candidates[0]?.content);

    // Save the generated messages to MongoDB using BotMessage model
    const botMessageToSave = new BotMessage({
      content: result.candidates[0]?.content,
    });

    await botMessageToSave.save();
    console.log('Message saved to database:', botMessageToSave);

    messages.push({ content: result.candidates[0]?.content });

    res.status(200).json({ resp: messages });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      metadata: error.metadata,
    });
  
    res.status(500).json({ error: 'Internal Server Error', details: error.details });
  }
});

module.exports = router;
