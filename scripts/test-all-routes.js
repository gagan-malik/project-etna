#!/usr/bin/env node

/**
 * Test all API routes
 * Usage: node scripts/test-all-routes.js
 * 
 * Note: This requires you to be logged in (have a session cookie)
 * Run this in browser console instead for easier cookie handling
 */

const BASE_URL = 'http://localhost:3000';

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

async function testEndpoint(method, endpoint, body = null, description) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    const status = response.status;
    const isSuccess = status >= 200 && status < 300;

    console.log(
      `${isSuccess ? colors.green : colors.red}${method} ${endpoint}${colors.reset}`,
      `→ ${status} ${response.statusText}`
    );
    
    if (description) {
      console.log(`  ${colors.blue}${description}${colors.reset}`);
    }

    if (!isSuccess) {
      console.log(`  ${colors.red}Error:${colors.reset}`, data.error || data);
    }

    return { success: isSuccess, data, status };
  } catch (error) {
    console.log(`${colors.red}${method} ${endpoint}${colors.reset} → Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`${colors.blue}🧪 Testing All API Routes${colors.reset}\n`);

  // Note: These tests require authentication
  // You need to be logged in for these to work
  console.log(`${colors.yellow}⚠️  Note: Make sure you're logged in!${colors.reset}\n`);

  let spaceId = null;
  let conversationId = null;
  let messageId = null;

  // Test Spaces API
  console.log(`${colors.blue}📦 Testing Spaces API${colors.reset}`);
  const spacesList = await testEndpoint('GET', '/api/spaces', null, 'List all spaces');
  
  if (spacesList.success && spacesList.data.spaces?.length > 0) {
    spaceId = spacesList.data.spaces[0].id;
    console.log(`  Found existing space: ${spaceId}\n`);
  } else {
    const createSpace = await testEndpoint(
      'POST',
      '/api/spaces',
      { name: 'Test Workspace ' + Date.now() },
      'Create a new space'
    );
    if (createSpace.success) {
      spaceId = createSpace.data.space?.id;
      console.log(`  Created space: ${spaceId}\n`);
    }
  }

  // Test Conversations API
  console.log(`${colors.blue}💬 Testing Conversations API${colors.reset}`);
  const conversationsList = await testEndpoint('GET', '/api/conversations', null, 'List all conversations');
  
  if (conversationsList.success && conversationsList.data.conversations?.length > 0) {
    conversationId = conversationsList.data.conversations[0].id;
    console.log(`  Found existing conversation: ${conversationId}\n`);
  } else {
    const createConv = await testEndpoint(
      'POST',
      '/api/conversations',
      { title: 'Test Conversation ' + Date.now() },
      'Create a new conversation'
    );
    if (createConv.success) {
      conversationId = createConv.data.conversation?.id;
      console.log(`  Created conversation: ${conversationId}\n`);
    }
  }

  // Test Messages API
  if (conversationId) {
    console.log(`${colors.blue}📝 Testing Messages API${colors.reset}`);
    const createMsg = await testEndpoint(
      'POST',
      '/api/messages',
      {
        conversationId,
        content: 'Test message ' + Date.now(),
        role: 'user',
      },
      'Create a new message'
    );
    if (createMsg.success) {
      messageId = createMsg.data.message?.id;
      console.log(`  Created message: ${messageId}\n`);
    }
  }

  // Test Documents API
  console.log(`${colors.blue}📄 Testing Documents API${colors.reset}`);
  await testEndpoint('GET', '/api/documents', null, 'List all documents');

  console.log(`\n${colors.green}✅ Testing complete!${colors.reset}`);
  console.log(`\n${colors.yellow}💡 Tip: For full testing with authentication, use the browser console at http://localhost:3000/test-api${colors.reset}`);
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };

