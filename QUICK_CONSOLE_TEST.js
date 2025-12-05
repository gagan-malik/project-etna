// 🧪 Quick API Routes Test - Copy and paste this into browser console
// Make sure you're logged in at http://localhost:3000

(async function testAllRoutes() {
  console.log('🧪 Testing All API Routes...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // 📦 Test 1: Get Spaces
    console.log('📦 Test 1: GET /api/spaces');
    const spaces = await fetch('/api/spaces', { credentials: 'include' }).then(r => r.json());
    console.log('✅ Result:', spaces);
    console.log(`   Found ${spaces.spaces?.length || 0} spaces\n`);
    
    // 📦 Test 2: Create Space
    console.log('📦 Test 2: POST /api/spaces');
    const newSpace = await fetch('/api/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: 'Test Workspace ' + new Date().toLocaleTimeString() })
    }).then(r => r.json());
    console.log('✅ Result:', newSpace);
    const spaceId = newSpace.space?.id;
    if (spaceId) console.log(`   Created space ID: ${spaceId}\n`);
    
    // 💬 Test 3: Get Conversations
    console.log('💬 Test 3: GET /api/conversations');
    const conversations = await fetch('/api/conversations', { credentials: 'include' }).then(r => r.json());
    console.log('✅ Result:', conversations);
    console.log(`   Found ${conversations.conversations?.length || 0} conversations\n`);
    
    // 💬 Test 4: Create Conversation
    console.log('💬 Test 4: POST /api/conversations');
    const newConv = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: 'Test Chat ' + new Date().toLocaleTimeString() })
    }).then(r => r.json());
    console.log('✅ Result:', newConv);
    const convId = newConv.conversation?.id;
    if (convId) console.log(`   Created conversation ID: ${convId}\n`);
    
    // 📝 Test 5: Create Messages
    if (convId) {
      console.log('📝 Test 5: POST /api/messages (Message 1)');
      const msg1 = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: convId,
          content: 'Hello! This is my first test message.',
          role: 'user'
        })
      }).then(r => r.json());
      console.log('✅ Result:', msg1);
      console.log(`   Created message ID: ${msg1.message?.id}\n`);
      
      console.log('📝 Test 6: POST /api/messages (Message 2)');
      const msg2 = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: convId,
          content: 'This is my second test message. Testing the API!',
          role: 'user'
        })
      }).then(r => r.json());
      console.log('✅ Result:', msg2);
      console.log(`   Created message ID: ${msg2.message?.id}\n`);
      
      // 📝 Test 7: Get Full Conversation
      console.log('📝 Test 7: GET /api/conversations/[id]');
      const fullConv = await fetch(`/api/conversations/${convId}`, { credentials: 'include' }).then(r => r.json());
      console.log('✅ Result:', fullConv);
      console.log(`   Conversation title: ${fullConv.conversation?.title}`);
      console.log(`   Total messages: ${fullConv.conversation?.messages?.length || 0}`);
      if (fullConv.conversation?.messages?.length > 0) {
        console.log('   Messages:');
        fullConv.conversation.messages.forEach((msg, i) => {
          console.log(`     ${i + 1}. [${msg.role}] ${msg.content.substring(0, 50)}...`);
        });
      }
      console.log('');
    }
    
    // 📄 Test 8: Get Documents
    console.log('📄 Test 8: GET /api/documents');
    const docs = await fetch('/api/documents', { credentials: 'include' }).then(r => r.json());
    console.log('✅ Result:', docs);
    console.log(`   Found ${docs.documents?.length || 0} documents\n`);
    
    // 📄 Test 9: Create Document
    console.log('📄 Test 9: POST /api/documents');
    const newDoc = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: 'Test Document ' + new Date().toLocaleTimeString(),
        content: 'This is a test document created via API. It contains some sample content for testing the documents API endpoint.',
        source: 'test',
        metadata: { test: true, created: new Date().toISOString() }
      })
    }).then(r => r.json());
    console.log('✅ Result:', newDoc);
    console.log(`   Created document ID: ${newDoc.document?.id}\n`);
    
    // 📄 Test 10: Search Documents
    console.log('📄 Test 10: POST /api/documents/search');
    const search = await fetch('/api/documents/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: 'test', limit: 5 })
    }).then(r => r.json());
    console.log('✅ Result:', search);
    console.log(`   Found ${search.documents?.length || 0} matching documents\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All API tests completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
})();

