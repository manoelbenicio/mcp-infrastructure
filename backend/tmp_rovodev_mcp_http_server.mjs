#!/usr/bin/env node
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MCP HTTP Sample',
    timestamp: new Date().toISOString()
  });
});

// Tools endpoint - returns available MCP tools
app.get('/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'analyze_meeting',
        description: 'Analyze meeting transcript and extract insights',
        inputSchema: {
          type: 'object',
          properties: {
            transcript: { type: 'string' },
            language: { type: 'string', default: 'en' }
          },
          required: ['transcript']
        }
      },
      {
        name: 'extract_action_items',
        description: 'Extract action items from meeting transcript',
        inputSchema: {
          type: 'object',
          properties: {
            transcript: { type: 'string' }
          },
          required: ['transcript']
        }
      },
      {
        name: 'sentiment_analysis',
        description: 'Analyze sentiment of meeting participants',
        inputSchema: {
          type: 'object',
          properties: {
            transcript: { type: 'string' }
          },
          required: ['transcript']
        }
      }
    ]
  });
});

// Execute tool endpoint
app.post('/execute', (req, res) => {
  const { tool, input } = req.body;
  
  // Mock response for demo
  res.json({
    success: true,
    tool,
    result: `Mock result for ${tool} with input: ${JSON.stringify(input).substring(0, 100)}...`
  });
});

app.listen(PORT, () => {
  console.log(`✅ MCP HTTP Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Tools: http://localhost:${PORT}/tools`);
});
