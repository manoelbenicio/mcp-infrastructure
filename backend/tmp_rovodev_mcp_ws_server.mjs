#!/usr/bin/env node
import { WebSocketServer } from 'ws';
import http from 'http';

const PORT = 4000;
const server = http.createServer();
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('✅ Client connected to MCP WebSocket');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle JSON-RPC style messages
      if (data.method === 'tools/list') {
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: data.id,
          result: {
            tools: [
              {
                name: 'analyze_meeting',
                description: 'Analyze meeting transcript via WebSocket',
                inputSchema: {
                  type: 'object',
                  properties: {
                    transcript: { type: 'string' }
                  }
                }
              },
              {
                name: 'extract_topics',
                description: 'Extract discussion topics from transcript',
                inputSchema: {
                  type: 'object',
                  properties: {
                    transcript: { type: 'string' }
                  }
                }
              }
            ]
          }
        }));
      } else if (data.method === 'tools/call') {
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: data.id,
          result: {
            success: true,
            toolName: data.params.name,
            output: `Mock result for ${data.params.name}`
          }
        }));
      } else if (data.method === 'ping') {
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: data.id,
          result: 'pong'
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected from MCP WebSocket');
  });

  // Send welcome message
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    method: 'notification',
    params: {
      message: 'Connected to MCP WebSocket Server',
      timestamp: new Date().toISOString()
    }
  }));
});

server.listen(PORT, () => {
  console.log(`✅ MCP WebSocket Server running on ws://localhost:${PORT}/ws`);
});
