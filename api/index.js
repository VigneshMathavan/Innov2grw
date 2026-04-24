import express from 'express';
import cors from 'cors';
import { 
  generateDemoContent, 
  handleChat, 
  handleRewrite, 
  handleNodeExecution, 
  handleCodeGeneration, 
  handlePostEnhancement 
} from './ai.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-demo', async (req, res) => {
  const { businessType, goal, channel, businessName } = req.body;
  try {
    const data = await generateDemoContent(businessType, goal, channel, businessName);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, businessName, businessType } = req.body;
  try {
    const data = await handleChat(messages, businessName, businessType);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/rewrite', async (req, res) => {
  const { section, currentData, instruction, businessName, businessType } = req.body;
  try {
    const data = await handleRewrite(section, currentData, instruction, businessName, businessType);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/execute-node', async (req, res) => {
  const { nodeLabel, payload } = req.body;
  try {
    const data = await handleNodeExecution(nodeLabel, payload);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/generate-code', async (req, res) => {
  const { prompt } = req.body;
  try {
    const data = await handleCodeGeneration(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/enhance-post', async (req, res) => {
  const { draft } = req.body;
  try {
    const data = await handlePostEnhancement(draft);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default app;
