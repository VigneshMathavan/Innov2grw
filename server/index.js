import express from 'express';
import cors from 'cors';
import { generateDemoContent } from './ai.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-demo', async (req, res) => {
  const { businessType, goal, channel, businessName } = req.body;
  
  if (!businessType || !goal || !channel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const data = await generateDemoContent(businessType, goal, channel, businessName);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate demo' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, businessName, businessType } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid message history' });
  }

  try {
    const { handleChat } = await import('./ai.js');
    const data = await handleChat(messages, businessName, businessType);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

app.post('/api/rewrite', async (req, res) => {
  const { section, currentData, instruction, businessName, businessType } = req.body;
  if (!section || !currentData || !instruction) {
    return res.status(400).json({ error: 'Missing rewrite parameters' });
  }

  try {
    const { handleRewrite } = await import('./ai.js');
    const data = await handleRewrite(section, currentData, instruction, businessName, businessType);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to rewrite section' });
  }
});

app.post('/api/execute-node', async (req, res) => {
  const { nodeLabel, payload } = req.body;
  if (!nodeLabel) {
    return res.status(400).json({ error: 'Missing nodeLabel parameter' });
  }

  try {
    const { handleNodeExecution } = await import('./ai.js');
    const data = await handleNodeExecution(nodeLabel, payload);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute node' });
  }
});

app.post('/api/generate-code', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  try {
    const { handleCodeGeneration } = await import('./ai.js');
    const data = await handleCodeGeneration(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
});
app.post('/api/enhance-post', async (req, res) => {
  const { draft } = req.body;
  if (!draft) {
    return res.status(400).json({ error: 'Missing draft parameter' });
  }

  try {
    const { handlePostEnhancement } = await import('./ai.js');
    const data = await handlePostEnhancement(draft);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enhance post' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
