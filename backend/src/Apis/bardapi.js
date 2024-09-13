
const express = require('express');
const router = express.Router();
const { DiscussServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');
const mongoose = require('mongoose');
const BotMessage = require('../models/BotMessage');  // Import the bot message model
const { GoogleGenerativeAI } = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-flash";

// const MODEL_NAME = 'models/chat-bison-002';
const API_KEY = process.env.BARD_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Connect to MongoDB
mongoose.connect('mongodb+srv://taief:OLbREgM8bj97e9pX@foodordering.yziiffk.mongodb.net/?retryWrites=true&w=majority&appName=foodordering', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// const client = new DiscussServiceClient({
//   authClient: new GoogleAuth().fromAPIKey(API_KEY),
// });
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Define the model to use
// router.get('/generate-message', async (req, res) => {
//   let messages = [{ content: req.query.ques }];

//   try {
//     const [result] = await client.generateMessage({
//       model: MODEL_NAME,
//       temperature: 0.25,
//       candidateCount: 1,
//       top_k: 40,
//       top_p: 0.95,
//       prompt: { messages: messages },
//     });

//     console.log('First Response:', result.candidates[0]?.content);

//     // Save the generated messages to MongoDB using BotMessage model
//     const botMessageToSave = new BotMessage({
//       content: result.candidates[0]?.content,
//     });

//     await botMessageToSave.save();
//     console.log('Message saved to database:', botMessageToSave);

//     messages.push({ content: result.candidates[0]?.content });

//     res.status(200).json({ resp: messages });
//   } catch (error) {
//     console.error('Error details:', {
//       message: error.message,
//       code: error.code,
//       details: error.details,
//       metadata: error.metadata,
//     });
  
//     res.status(500).json({ error: 'Internal Server Error', details: error.details });
//   }
// });
router.get('/generate-message', async (req, res) => {
  const inputMessage = req.query.ques || "Hello!";  // Default message if none provided

  try {
    // Fetch the generative model
    const model = await genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    // Start a new chat session
    const chatSession = await model.startChat({
      generationConfig,
      history: [],
    });

    // Send the user's message
    const result = await chatSession.sendMessage(inputMessage);

    // Extract the generated response
    const botResponse = result.response.text();
    console.log("Generated Response:", botResponse);

    // Save the generated response to the database using BotMessage model
    const botMessageToSave = new BotMessage({
      content: botResponse,
      createdAt: new Date(),
    });

    await botMessageToSave.save();
    console.log('Message saved to database:', botMessageToSave);

    // Send the response back to the client
    res.status(200).json({ resp: botResponse });
  } catch (error) {
    console.error('Error details:', error.message, error.stack);

    // Check for errors during saving
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation Error:', error);
    } else {
      console.error('Database Save Error:', error);
    }

    // Send an error response back to the client
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
