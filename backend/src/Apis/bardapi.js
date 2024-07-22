const express = require('express');
const router = express.Router();
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.BARD_API_KEY;

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

    console.log("First Response:", result.candidates[0]?.content);

    messages.push({ content: result.candidates[0]?.content });
    res.status(200).json({ resp: messages });
  } catch (error) {
    console.error("Error generating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
