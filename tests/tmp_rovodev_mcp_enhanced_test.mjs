#!/usr/bin/env node
/**
 * Enhanced MCP Testing Suite
 * Tests real MCP servers with proper scenarios
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';

const testResults = [];

// Helper function to test an MCP server
async function testMCPServer(config) {
  const result = {
    name: config.name,
    connected: false,
    initialized: false,
    toolCount: 0,
    tools: [],
    testResults: [],
    errors: [],
    duration: 0
  };

  const startTime = Date.now();

  try {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 Testing: ${config.name}`);
    console.log(`   Command: ${config.command} ${config.args.join(' ')}`);
    console.log('='.repeat(70));

    // Create transport
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: { ...process.env, ...config.env }
    });

    // Create client
    const client = new Client({
      name: 'mcp-comprehensive-tester',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    // Connect
    console.log('🔌 Connecting...');
    await client.connect(transport);
    result.connected = true;
    console.log('✅ Connected successfully');

    // List tools
    console.log('📋 Discovering tools...');
    const toolsResponse = await client.listTools();
    result.toolCount = toolsResponse.tools?.length || 0;
    result.tools = toolsResponse.tools || [];
    console.log(`✅ Discovered ${result.toolCount} tools`);
    
    if (result.toolCount > 0) {
      console.log(`   Tools: ${result.tools.slice(0, 5).map(t => t.name).join(', ')}${result.toolCount > 5 ? '...' : ''}`);
    }

    // Run test scenarios
    if (config.tests && config.tests.length > 0) {
      console.log(`\n🎯 Running ${config.tests.length} test scenarios...\n`);
      
      for (const test of config.tests) {
        try {
          console.log(`   Test: ${test.description}`);
          const testStart = Date.now();
          
          const response = await client.callTool({
            name: test.tool,
            arguments: test.args
          });
          
          const testDuration = Date.now() - testStart;
          console.log(`   ✅ Success (${testDuration}ms)`);
          
          result.testResults.push({
            test: test.description,
            tool: test.tool,
            success: true,
            duration: testDuration,
            responseLength: JSON.stringify(response).length
          });
        } catch (error) {
          console.log(`   ❌ Failed: ${error.message.substring(0, 100)}`);
          result.testResults.push({
            test: test.description,
            tool: test.tool,
            success: false,
            error: error.message
          });
          result.errors.push(`Test "${test.description}": ${error.message}`);
        }
      }
    }

    // Cleanup
    await client.close();
    console.log('🔌 Disconnected');

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    result.errors.push(error.message);
  }

  result.duration = Date.now() - startTime;
  return result;
}

// Test configurations
const testConfigs = [
  {
    name: 'GitHub Official MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || ''
    },
    tests: [
      {
        description: 'Search for modelcontextprotocol repositories',
        tool: 'search_repositories',
        args: {
          query: 'modelcontextprotocol',
          maxResults: 3
        }
      },
      {
        description: 'Search for MCP-related code',
        tool: 'search_code',
        args: {
          query: 'Model Context Protocol',
          maxResults: 3
        }
      },
      {
        description: 'Search for MCP issues',
        tool: 'search_issues',
        args: {
          query: 'MCP server',
          maxResults: 3
        }
      }
    ]
  },
  {
    name: 'Puppeteer MCP (Browser Automation)',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-puppeteer'],
    env: {},
    tests: [
      {
        description: 'Navigate to localhost MCP monitor',
        tool: 'puppeteer_navigate',
        args: {
          url: 'http://localhost:8080'
        }
      },
      {
        description: 'Take screenshot',
        tool: 'puppeteer_screenshot',
        args: {
          name: 'mcp-monitor-test'
        }
      }
    ]
  },
  {
    name: 'Filesystem MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
    env: {},
    tests: [
      {
        description: 'Read package.json',
        tool: 'read_file',
        args: {
          path: 'package.json'
        }
      },
      {
        description: 'List workspace files',
        tool: 'list_directory',
        args: {
          path: '.'
        }
      }
    ]
  },
  {
    name: 'Memory MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
    env: {},
    tests: [
      {
        description: 'Store test knowledge',
        tool: 'store_memory',
        args: {
          key: 'test_mcp_deployment',
          value: 'MCP servers successfully tested on ' + new Date().toISOString()
        }
      },
      {
        description: 'Retrieve stored knowledge',
        tool: 'retrieve_memory',
        args: {
          key: 'test_mcp_deployment'
        }
      }
    ]
  }
];

// Main execution
async function main() {
  console.log('\n');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║' + ' '.repeat(15) + 'MCP SERVERS COMPREHENSIVE TEST SUITE' + ' '.repeat(17) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║' + ' '.repeat(10) + 'Testing Real MCP Servers with Development Scenarios' + ' '.repeat(7) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');
  console.log('\n');

  // Test each server
  for (const config of testConfigs) {
    const result = await testMCPServer(config);
    testResults.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate summary report
  console.log('\n\n');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(25) + 'TEST SUMMARY' + ' '.repeat(31) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');
  
  const totalTests = testResults.reduce((sum, r) => sum + r.testResults.length, 0);
  const passedTests = testResults.reduce((sum, r) => 
    sum + r.testResults.filter(t => t.success).length, 0);
  const totalTools = testResults.reduce((sum, r) => sum + r.toolCount, 0);
  const connectedServers = testResults.filter(r => r.connected).length;

  console.log('\n📊 Overall Statistics:\n');
  console.log(`   Servers Tested: ${testResults.length}`);
  console.log(`   Successful Connections: ${connectedServers}/${testResults.length}`);
  console.log(`   Total Tools Discovered: ${totalTools}`);
  console.log(`   Total Tests Executed: ${totalTests}`);
  console.log(`   Passed Tests: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);

  console.log('\n📋 Server Details:\n');

  for (const result of testResults) {
    const status = result.connected 
      ? (result.errors.length === 0 ? '✅ PASS' : '⚠️  PARTIAL')
      : '❌ FAIL';
    
    console.log(`   ${status} ${result.name}`);
    console.log(`      Connected: ${result.connected ? '✅' : '❌'}`);
    console.log(`      Tools Discovered: ${result.toolCount}`);
    console.log(`      Tests: ${result.testResults.length} (${result.testResults.filter(t => t.success).length} passed)`);
    console.log(`      Duration: ${result.duration}ms`);
    
    if (result.testResults.length > 0) {
      console.log(`      Test Results:`);
      result.testResults.forEach(test => {
        const icon = test.success ? '✅' : '❌';
        console.log(`         ${icon} ${test.test}`);
        if (test.success) {
          console.log(`            Duration: ${test.duration}ms, Response: ${test.responseLength} bytes`);
        } else {
          console.log(`            Error: ${test.error?.substring(0, 80)}...`);
        }
      });
    }
    
    if (result.errors.length > 0 && !result.testResults.length) {
      console.log(`      Errors:`);
      result.errors.forEach(err => {
        console.log(`         • ${err.substring(0, 80)}...`);
      });
    }
    console.log('');
  }

  // Generate detailed JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalServers: testResults.length,
      connectedServers,
      totalTools,
      totalTests,
      passedTests,
      successRate: Math.round(passedTests/totalTests*100)
    },
    servers: testResults.map(r => ({
      name: r.name,
      connected: r.connected,
      toolCount: r.toolCount,
      tools: r.tools.map(t => ({ name: t.name, description: t.description?.substring(0, 100) })),
      tests: r.testResults,
      errors: r.errors,
      duration: r.duration,
      status: r.connected ? (r.errors.length === 0 ? 'PASS' : 'PARTIAL') : 'FAIL'
    }))
  };

  const reportPath = 'tmp_rovodev_mcp_comprehensive_report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 Detailed JSON report saved to: ${reportPath}\n`);

  // Create markdown report
  const markdownReport = generateMarkdownReport(report);
  const mdPath = 'tmp_rovodev_mcp_test_results.md';
  fs.writeFileSync(mdPath, markdownReport);
  console.log(`📄 Markdown report saved to: ${mdPath}\n`);

  console.log('='.repeat(70));
  console.log('✨ Testing complete!\n');

  return report;
}

function generateMarkdownReport(report) {
  let md = `# MCP Servers Comprehensive Test Report

**Generated:** ${report.timestamp}

---

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| Servers Tested | ${report.summary.totalServers} |
| Successful Connections | ${report.summary.connectedServers}/${report.summary.totalServers} |
| Total Tools Discovered | ${report.summary.totalTools} |
| Total Tests Executed | ${report.summary.totalTests} |
| Passed Tests | ${report.summary.passedTests}/${report.summary.totalTests} (${report.summary.successRate}%) |

---

## 🔍 Server Test Results

`;

  for (const server of report.servers) {
    const statusEmoji = server.status === 'PASS' ? '✅' : server.status === 'PARTIAL' ? '⚠️' : '❌';
    
    md += `### ${statusEmoji} ${server.name}

**Status:** ${server.status}  
**Connected:** ${server.connected ? '✅ Yes' : '❌ No'}  
**Tools Discovered:** ${server.toolCount}  
**Test Duration:** ${server.duration}ms

`;

    if (server.toolCount > 0) {
      md += `#### Available Tools (${server.toolCount})

`;
      server.tools.slice(0, 10).forEach(tool => {
        md += `- **${tool.name}**: ${tool.description || 'No description'}\n`;
      });
      if (server.tools.length > 10) {
        md += `- *...and ${server.tools.length - 10} more tools*\n`;
      }
      md += '\n';
    }

    if (server.tests.length > 0) {
      md += `#### Test Results (${server.tests.filter(t => t.success).length}/${server.tests.length} passed)

| Test | Tool | Result | Duration |
|------|------|--------|----------|
`;
      server.tests.forEach(test => {
        const result = test.success ? '✅ Pass' : '❌ Fail';
        const duration = test.duration ? `${test.duration}ms` : 'N/A';
        md += `| ${test.test} | \`${test.tool}\` | ${result} | ${duration} |\n`;
      });
      md += '\n';
    }

    if (server.errors.length > 0) {
      md += `#### Errors

`;
      server.errors.forEach(err => {
        md += `- ${err}\n`;
      });
      md += '\n';
    }

    md += '---\n\n';
  }

  md += `## 🎯 Recommendations

`;

  if (report.summary.successRate === 100) {
    md += `✅ **All tests passed!** The MCP infrastructure is working correctly.

`;
  } else if (report.summary.successRate >= 75) {
    md += `⚠️ **Most tests passed.** Some minor issues need attention.

`;
  } else if (report.summary.successRate >= 50) {
    md += `⚠️ **Partial success.** Several issues need to be addressed.

`;
  } else {
    md += `❌ **Significant issues detected.** Major troubleshooting required.

`;
  }

  md += `### Next Steps

1. Review failed tests and error messages
2. Check API tokens and credentials for external services
3. Verify network connectivity to required services
4. Ensure all required dependencies are installed
5. Test Docker Desktop MCP Toolkit servers separately

---

*Report generated by MCP Comprehensive Test Suite*
`;

  return md;
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
