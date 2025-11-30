import { useState, useEffect } from 'react'

interface MCPServer {
  id: string
  name: string
  transport: 'http' | 'ws'
  status: 'up' | 'down'
  latency?: number
  toolsCount?: number
  error?: string
}

const MCP_PROXY_URL = 'http://localhost:5179'

function App() {
  const [servers, setServers] = useState<MCPServer[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMCPStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${MCP_PROXY_URL}/mcp/health`)
      const data = await response.json()
      setServers(data.results || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch MCP status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMCPStatus()
    const interval = setInterval(fetchMCPStatus, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const upCount = servers.filter(s => s.status === 'up').length
  const downCount = servers.filter(s => s.status === 'down').length
  const avgLatency = servers.filter(s => s.latency).reduce((sum, s) => sum + (s.latency || 0), 0) / servers.filter(s => s.latency).length || 0

  return (
    <div className="dashboard">
      <div className="header">
        <h1>🔌 MCP Server Monitor</h1>
        <p className="subtitle">Development & Testing Dashboard | Real-time Status Monitoring</p>
      </div>

      {loading && servers.length === 0 ? (
        <div className="loading">Loading MCP servers...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Servers</h3>
              <div className="value">{servers.length}</div>
            </div>
            <div className="stat-card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
              <h3>Online</h3>
              <div className="value">{upCount}</div>
            </div>
            <div className="stat-card" style={{background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
              <h3>Offline</h3>
              <div className="value">{downCount}</div>
            </div>
            <div className="stat-card" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
              <h3>Avg Latency</h3>
              <div className="value">{avgLatency.toFixed(1)}<span style={{fontSize: '1rem'}}>ms</span></div>
            </div>
          </div>

          <div className="servers-section">
            <h2>Active MCP Servers</h2>
            <div className="server-list">
              {servers.map(server => (
                <div key={server.id} className={`server-card status-${server.status}`}>
                  <div className="server-header">
                    <div className="server-name">{server.name}</div>
                    <div className={`status-badge ${server.status}`}>
                      <span className="status-dot"></span>
                      {server.status}
                    </div>
                  </div>

                  <div className="server-details">
                    <div className="detail-item">
                      <div className="detail-label">Server ID</div>
                      <div className="detail-value">{server.id}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Transport</div>
                      <div className="detail-value">{server.transport.toUpperCase()}</div>
                    </div>
                    {server.latency !== undefined && (
                      <div className="detail-item">
                        <div className="detail-label">Latency</div>
                        <div className="detail-value">{server.latency}ms</div>
                      </div>
                    )}
                    {server.toolsCount !== undefined && (
                      <div className="detail-item">
                        <div className="detail-label">Available Tools</div>
                        <div className="detail-value">{server.toolsCount}</div>
                      </div>
                    )}
                  </div>

                  {server.status === 'up' && server.toolsCount && server.toolsCount > 0 && (
                    <div className="tools-section">
                      <h4>🛠️ Tools Available ({server.toolsCount})</h4>
                      <div className="tools-list">
                        <div className="tool-badge">analyze_meeting</div>
                        <div className="tool-badge">extract_action_items</div>
                        <div className="tool-badge">sentiment_analysis</div>
                      </div>
                    </div>
                  )}

                  {server.error && (
                    <div className="error-section">
                      <h4>⚠️ Error Details</h4>
                      <div className="error-message">{server.error}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="vscode-integration">
            <h3>💡 VS Code Integration</h3>
            <p>
              These MCP servers are configured and ready to use with VS Code extensions.
              <br />
              When enabled, AI assistants in VS Code can access these tools for enhanced capabilities.
            </p>
            <div className="vscode-badge">✓ VS Code MCP Ready</div>
          </div>

          {lastUpdate && (
            <p style={{textAlign: 'center', color: '#6b7280', marginTop: '32px', fontSize: '0.875rem'}}>
              Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 5s
            </p>
          )}
        </>
      )}

      <button className="refresh-button" onClick={fetchMCPStatus}>
        🔄 Refresh Now
      </button>
    </div>
  )
}

export default App
