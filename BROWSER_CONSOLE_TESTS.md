# 🌐 Browser Console API Tests

Copy and paste these into your browser console (F12 → Console) while logged in at http://localhost:3000

---

## 🚀 Quick Test All Routes

```javascript
// Test all routes at once
async function testAllRoutes() {
  console.log('🧪 Testing All API Routes...\n');
  
  // Test Spaces
  console.log('📦 Testing Spaces API');
  const spaces = await fetch('/api/spaces', { credentials: 'include' }).then(r => r.json());
  console.log('GET /api/spaces:', spaces);
  
  const newSpace = await fetch('/api/spaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name: 'Test Workspace ' + Date.now() })
  }).then(r => r.json());
  console.log('POST /api/spaces:', newSpace);
  const spaceId = newSpace.space?.id;
  
  // Test Conversations
  console.log('\n💬 Testing Conversations API');
  const conversations = await fetch('/api/conversations', { credentials: 'include' }).then(r => r.json());
  console.log('GET /api/conversations:', conversations);
  
  const newConv = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title: 'Test Chat ' + Date.now() })
  }).then(r => r.json());
  console.log('POST /api/conversations:', newConv);
  const convId = newConv.conversation?.id;
  
  // Test Messages
  if (convId) {
    console.log('\n📝 Testing Messages API');
    const msg1 = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        conversationId: convId,
        content: 'Hello! This is message 1',
        role: 'user'
      })
    }).then(r => r.json());
    console.log('POST /api/messages (1):', msg1);
    
    const msg2 = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        conversationId: convId,
        content: 'This is message 2',
        role: 'user'
      })
    }).then(r => r.json());
    console.log('POST /api/messages (2):', msg2);
    
    // Get full conversation
    const fullConv = await fetch(`/api/conversations/${convId}`, { credentials: 'include' }).then(r => r.json());
    console.log('GET /api/conversations/[id]:', fullConv);
    console.log(`✅ Conversation has ${fullConv.conversation?.messages?.length || 0} messages!`);
  }
  
  // Test Documents
  console.log('\n📄 Testing Documents API');
  const docs = await fetch('/api/documents', { credentials: 'include' }).then(r => r.json());
  console.log('GET /api/documents:', docs);
  
  const newDoc = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: 'Test Document',
      content: 'This is test document content for API testing.',
      source: 'test'
    })
  }).then(r => r.json());
  console.log('POST /api/documents:', newDoc);
  
  console.log('\n✅ All tests complete!');
}

// Run it!
testAllRoutes();
```

---

## 📦 Individual Space Tests

```javascript
// Create a space
const space = await fetch('/api/spaces', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ name: 'My Workspace' })
}).then(r => r.json());
console.log('Created space:', space);

// Get all spaces
const spaces = await fetch('/api/spaces', { credentials: 'include' }).then(r => r.json());
console.log('All spaces:', spaces);

// Get specific space (replace SPACE_ID)
const spaceId = spaces.spaces[0]?.id;
if (spaceId) {
  const spaceDetail = await fetch(`/api/spaces/${spaceId}`, { credentials: 'include' }).then(r => r.json());
  console.log('Space detail:', spaceDetail);
}
```

---

## 💬 Individual Conversation Tests

```javascript
// Create a conversation
const conv = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ title: 'My Chat' })
}).then(r => r.json());
console.log('Created conversation:', conv);
const convId = conv.conversation?.id;

// Get all conversations
const conversations = await fetch('/api/conversations', { credentials: 'include' }).then(r => r.json());
console.log('All conversations:', conversations);

// Get specific conversation
if (convId) {
  const convDetail = await fetch(`/api/conversations/${convId}`, { credentials: 'include' }).then(r => r.json());
  console.log('Conversation detail:', convDetail);
}
```

---

## 📝 Individual Message Tests

```javascript
// First, get or create a conversation
const conv = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ title: 'Test Chat' })
}).then(r => r.json());
const convId = conv.conversation?.id;

// Create messages
if (convId) {
  // Message 1
  const msg1 = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      conversationId: convId,
      content: 'Hello!',
      role: 'user'
    })
  }).then(r => r.json());
  console.log('Message 1:', msg1);
  
  // Message 2
  const msg2 = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      conversationId: convId,
      content: 'How are you?',
      role: 'user'
    })
  }).then(r => r.json());
  console.log('Message 2:', msg2);
  
  // Get conversation with all messages
  const fullConv = await fetch(`/api/conversations/${convId}`, { credentials: 'include' }).then(r => r.json());
  console.log('Full conversation:', fullConv);
  console.log(`Total messages: ${fullConv.conversation?.messages?.length || 0}`);
}
```

---

## 📄 Individual Document Tests

```javascript
// Create a document
const doc = await fetch('/api/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'My Document',
    content: 'This is the document content. It can be quite long and contain multiple paragraphs.',
    source: 'test',
    metadata: { author: 'Test User' }
  })
}).then(r => r.json());
console.log('Created document:', doc);

// Get all documents
const docs = await fetch('/api/documents', { credentials: 'include' }).then(r => r.json());
console.log('All documents:', docs);

// Search documents
const search = await fetch('/api/documents/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ query: 'document', limit: 5 })
}).then(r => r.json());
console.log('Search results:', search);
```

---

## 🎯 Complete Workflow Test

```javascript
// Complete workflow: Space → Conversation → Messages
async function completeWorkflow() {
  // 1. Create space
  const space = await fetch('/api/spaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name: 'Workflow Test Workspace' })
  }).then(r => r.json());
  console.log('✅ Created space:', space.space?.name);
  
  // 2. Create conversation
  const conv = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title: 'Workflow Test Chat' })
  }).then(r => r.json());
  const convId = conv.conversation?.id;
  console.log('✅ Created conversation:', conv.conversation?.title);
  
  // 3. Send messages
  if (convId) {
    for (let i = 1; i <= 3; i++) {
      const msg = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: convId,
          content: `This is message number ${i}`,
          role: 'user'
        })
      }).then(r => r.json());
      console.log(`✅ Created message ${i}`);
    }
    
    // 4. Get full conversation
    const full = await fetch(`/api/conversations/${convId}`, { credentials: 'include' }).then(r => r.json());
    console.log('✅ Full conversation:', full.conversation);
    console.log(`✅ Total messages: ${full.conversation?.messages?.length || 0}`);
  }
  
  console.log('\n🎉 Complete workflow test finished!');
}

completeWorkflow();
```

---

## 💡 Tips

1. **Open DevTools:** Press F12 (or Cmd+Option+I on Mac)
2. **Go to Console tab**
3. **Make sure you're logged in** at http://localhost:3000
4. **Copy and paste** any of the code blocks above
5. **Press Enter** to run

---

**Happy Testing!** 🚀

