# MCP Server Monitor Dashboard

**Standalone Development & Testing Dashboard**

## Purpose

This is a separate monitoring dashboard specifically for development and testing purposes. It allows teams to:

- Monitor MCP server status in real-time
- Verify VS Code integration connectivity
- Check available tools on each MCP server
- Monitor latency and performance
- Validate CORS/networking configuration
- Share monitoring across development teams on the same network

## Why Not Use Docker Desktop UI?

While Docker Desktop shows container status, this dashboard provides:

1. **Application-level health checks** - Not just if containers are up, but if MCP services are responding correctly
2. **VS Code integration validation** - Confirms MCP servers are accessible to VS Code extensions
3. **Tool discovery** - Shows which tools are available on each MCP server
4. **Network testing** - Validates CORS, connectivity, and permissions for internal development
5. **Team collaboration** - Other developers on the network can access this dashboard
6. **Business logic validation** - Tests actual MCP functionality, not just container status

## Running the Dashboard

```bash
cd mcp-monitor-ui
npm install
npm run dev
```

The dashboard will be available at: **http://localhost:8080**

## What It Monitors

- **MCP HTTP Server** (port 3001) - HTTP-based MCP endpoints
- **MCP WebSocket Server** (port 4000) - WebSocket MCP with JSON-RPC
- **MCP Proxy** (port 5179) - Health aggregation service

## Features

- ✅ Real-time status monitoring (auto-refresh every 5s)
- ✅ Latency tracking
- ✅ Tool availability display
- ✅ Error reporting
- ✅ VS Code integration indicator
- ✅ Network-accessible for team testing

## Architecture

```
┌─────────────────────┐
│  MCP Monitor UI     │  Port 8080 (This Dashboard)
│  (localhost:8080)   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  MCP Proxy Server   │  Port 5179
│  (Health Aggregator)│
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ↓           ↓
┌─────────┐  ┌──────────┐
│MCP HTTP │  │ MCP WS   │
│Port 3001│  │Port 4000 │
└─────────┘  └──────────┘
```

## Important Note

**This is NOT part of the client/production project.** This is a separate development tool for testing MCP infrastructure.
