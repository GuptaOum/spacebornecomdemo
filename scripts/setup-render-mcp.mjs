import fs from 'fs';
import path from 'path';

const API_KEY = 'rnd_S4QGpoxcRDbh4NtBqAkeMUmlcDud';
const MCP_URL = 'https://mcp.render.com/mcp';
const TARGET_DIR = 'C:/Users/hp/.gemini/antigravity/mcp/render';

async function setup() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('1. Initializing session on Render MCP server...');
  const initRes = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'antigravity', version: '1.0' }
      }
    })
  });

  const sessionId = initRes.headers.get('mcp-session-id');
  console.log('Session ID:', sessionId);

  console.log('2. Fetching available tools...');
  const toolsRes = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'mcp-session-id': sessionId
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    })
  });

  const data = await toolsRes.json();
  const tools = data.result?.tools || [];
  console.log(`Discovered ${tools.length} tools from Render MCP server:`);

  for (const tool of tools) {
    const filePath = path.join(TARGET_DIR, tool.name + '.json');
    const toolSchema = {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema
    };
    fs.writeFileSync(filePath, JSON.stringify(toolSchema, null, 2), 'utf8');
    console.log(` - Saved ${tool.name}.json`);
  }

  const instructions = `# Render MCP Server

Official Render MCP Server for full cloud resource management.
Endpoint: \`https://mcp.render.com/mcp\`

## Available Tools:
${tools.map(t => `- **\`${t.name}\`**: ${t.description}`).join('\n')}
`;
  fs.writeFileSync(path.join(TARGET_DIR, 'instructions.md'), instructions, 'utf8');
  console.log('Saved instructions.md');

  // 3. Test calling list_services
  console.log('3. Testing list_services tool call...');
  const callRes = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'mcp-session-id': sessionId
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'list_services',
        arguments: {}
      }
    })
  });
  const callData = await callRes.json();
  console.log('Tool call SUCCESS:');
  console.log(JSON.stringify(callData.result?.content || callData, null, 2).substring(0, 400) + '...');
}

setup().catch(console.error);
