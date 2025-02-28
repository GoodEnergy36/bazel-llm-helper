import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// POST endpoint for chat completions
router.post('/chat', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'OpenAI API key not configured. Please add your key in settings.'
      });
    }

    const { messages } = req.body;
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });
    
    return res.json({
      response: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error communicating with ChatGPT:', error);
    
    const errorMessage = error.response?.data?.error?.message ||
      error.message ||
      'Failed to communicate with ChatGPT';
      
    return res.status(error.status || 500).json({
      error: errorMessage
    });
  }
});

export default router;