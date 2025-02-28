import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import openaiRoute from './routes/api.chat';
import executePython from './routes/api.execute-python'

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use('/api', openaiRoute);

app.use('/api', executePython)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});