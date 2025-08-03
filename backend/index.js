const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// 👇 Add this so visiting "/" serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 🔑 Use API key from .env file
const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const cohereRes = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        message: userMessage,
        model: 'command-r-plus'
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = cohereRes.data.text;
    res.json({ reply });

  } catch (error) {
    console.error('Cohere Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Cohere API' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
