# 🚀 MCP Services - Quick Reference Card

**Last Updated:** 2025-11-30  
**Status:** ✅ All Services Running

---

## 📍 Service URLs (Copy & Paste Ready)

```
✅ MCP Monitor Dashboard:    http://localhost:8080
✅ MCP Proxy Health:         http://localhost:5179/mcp/health
✅ MCP HTTP Server Health:   http://localhost:3001/health
✅ MCP HTTP Server Tools:    http://localhost:3001/tools
✅ MCP WebSocket:            ws://localhost:4000/ws

📦 GitHub Repository:        https://github.com/manoelbenicio/mcp-infrastructure
```

---

## 🎯 Current Running Services

| Port | Service | Status | PID |
|------|---------|--------|-----|
| 3001 | MCP HTTP Server | ✅ UP | 22795 |
| 4000 | MCP WebSocket Server | ✅ UP | 22803 |
| 5179 | MCP Proxy Server | ✅ UP | 22812 |
| 8080 | MCP Monitor Dashboard | ✅ UP | 22833 |

---

## ⚡ Quick Commands

### Health Check All Services:
```bash
curl http://localhost:5179/mcp/health | jq '.'
```

### Open Monitor Dashboard:
```bash
open http://localhost:8080
# or
firefox http://localhost:8080
```

### Check What's Running:
```bash
ps aux | grep -E "mcp|node.*server" | grep -v grep
ss -tuln | grep -E "3001|4000|5179|8080"
```

### Restart All Services:
```bash
# Kill all
pkill -f "tmp_rovodev_mcp"

# Start all
node tmp_rovodev_mcp_http_server.mjs &
node tmp_rovodev_mcp_ws_server.mjs &
cd frontend/indra-meeting-analyst/server && node index.mjs &
cd mcp-monitor-ui && npm run dev &
```

---

## 📊 Pre-Deployment Checklist

Before every deploy, verify these URLs work:

1. ✅ http://localhost:3001/health → Returns `{"status":"healthy"}`
2. ✅ http://localhost:3001/tools → Returns tool list
3. ✅ http://localhost:5179/mcp/health → Returns aggregated health
4. ✅ http://localhost:8080 → Dashboard loads
5. ✅ ws://localhost:4000/ws → WebSocket connects

**All must return 2xx status!**

---

## 🔧 Architecture Diagram

```
┌─────────────────────────────────┐
│  Browser: http://localhost:8080 │  ← Your team accesses here
│  MCP Monitor Dashboard          │
└─────────────────┬───────────────┘
                  │
                  ↓ (polls every 5s)
      ┌───────────────────────┐
      │  http://localhost:5179 │
      │  MCP Proxy Server      │
      │  (Health Aggregator)   │
      └────────┬──────────┬────┘
               │          │
       ┌───────┘          └────────┐
       ↓                           ↓
┌──────────────┐          ┌──────────────┐
│ localhost:3001│          │ localhost:4000│
│ HTTP MCP      │          │ WebSocket MCP │
│ 3 tools       │          │ 2 tools       │
└──────────────┘          └──────────────┘
```

---

## 📱 Access Methods

### Local Access:
- All services: `http://localhost:PORT`
- Available on this machine only

### Network Access (for team):
- Dashboard: `http://172.18.156.111:8080`
- Requires services to bind to `0.0.0.0` instead of `localhost`

---

## 🐛 Common Issues & Fixes

### "Connection refused"
```bash
# Check if service is running
lsof -i :8080
# If not, start it
cd mcp-monitor-ui && npm run dev
```

### "Port already in use"
```bash
# Find and kill process
kill $(lsof -t -i:8080)
```

### Dashboard shows "DOWN"
```bash
# Restart backend servers
pkill -f mcp_http_server
node tmp_rovodev_mcp_http_server.mjs &
```

---

## 📚 Full Documentation

**Comprehensive Guide:** `SERVICES_INFRASTRUCTURE.md` (171 lines)

Includes:
- Detailed service descriptions
- All endpoints and tools
- Start/stop procedures
- Health monitoring
- Troubleshooting
- Production checklist

---

## 🎉 Quick Verification (30 seconds)

```bash
# 1. Check all services
curl -s http://localhost:5179/mcp/health | jq '.results[].status'

# Expected output:
# "up"
# "up"

# 2. Open dashboard
open http://localhost:8080

# 3. Verify all show GREEN (UP status)
```

**If all green = ready for deployment! 🚀**

---

## 💾 Repository Status

```
Repository:  manoelbenicio/mcp-infrastructure
Status:      ✅ Pushed and synced
Latest:      Frontend + Services docs added
Files:       23 files committed
URL:         https://github.com/manoelbenicio/mcp-infrastructure
```

---

**Keep this file handy for quick access to all service URLs and commands!**
