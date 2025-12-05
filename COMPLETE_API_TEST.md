# 🧪 Complete API Routes Testing Guide

Test all API endpoints systematically. Follow this guide step by step.

---

## 📋 Testing Checklist

### ✅ Spaces API
- [ ] GET /api/spaces - List all spaces
- [ ] POST /api/spaces - Create a space
- [ ] GET /api/spaces/[id] - Get specific space
- [ ] PATCH /api/spaces/[id] - Update space
- [ ] DELETE /api/spaces/[id] - Delete space

### ✅ Conversations API
- [ ] GET /api/conversations - List all conversations
- [ ] POST /api/conversations - Create a conversation
- [ ] GET /api/conversations/[id] - Get specific conversation
- [ ] PATCH /api/conversations/[id] - Update conversation
- [ ] DELETE /api/conversations/[id] - Delete conversation

### ✅ Messages API
- [ ] POST /api/messages - Create a message
- [ ] GET /api/messages/[id] - Get specific message
- [ ] PATCH /api/messages/[id] - Update message
- [ ] DELETE /api/messages/[id] - Delete message
- [ ] POST /api/messages/stream - Stream AI response (placeholder)

### ✅ Documents API
- [ ] GET /api/documents - List documents
- [ ] POST /api/documents - Create document
- [ ] POST /api/documents/search - Search documents
- [ ] GET /api/documents/[id] - Get specific document
- [ ] PATCH /api/documents/[id] - Update document
- [ ] DELETE /api/documents/[id] - Delete document

---

## 🚀 Step-by-Step Testing

### Step 1: Test Spaces API

#### 1.1 List Spaces
- **Go to:** http://localhost:3000/test-api
- **Click:** "GET /api/spaces"
- **Expected:** `{ spaces: [] }` or array of spaces
- **Status:** Should be `200 OK`

#### 1.2 Create Space
- **Change name to:** "My First Workspace"
- **Click:** "POST /api/spaces"
- **Expected:** `{ space: { id: "...", name: "My First Workspace", ... } }`
- **Status:** Should be `201 Created`
- **📝 Copy the space ID!** (You'll need it later)

#### 1.3 Get Specific Space
- **Note:** This requires the space ID from step 1.2
- **In browser console (F12), run:**
  ```javascript
  // First, get spaces to find an ID
  fetch('/api/spaces', { credentials: 'include' })
    .then(r => r.json())
    .then(data => {
      const spaceId = data.spaces[0]?.id;
      if (spaceId) {
        fetch(`/api/spaces/${spaceId}`, { credentials: 'include' })
          .then(r => r.json())
          .then(console.log);
      }
    });
  ```
- **Expected:** Full space object with conversations

---

### Step 2: Test Conversations API

#### 2.1 List Conversations
- **Click:** "GET /api/conversations"
- **Expected:** `{ conversations: [] }` or array
- **Status:** `200 OK`

#### 2.2 Create Conversation
- **Change title to:** "My First Chat"
- **Click:** "POST /api/conversations"
- **Expected:** `{ conversation: { id: "...", title: "My First Chat", ... } }`
- **Status:** `201 Created`
- **📝 Copy the conversation ID!** (Very important!)

#### 2.3 Get Specific Conversation
- **Paste conversation ID** in the "Conversation ID" field
- **Click:** "GET /api/conversations/[id]"
- **Expected:** Full conversation with messages array
- **Status:** `200 OK`

#### 2.4 Update Conversation
- **In browser console, run:**
  ```javascript
  const conversationId = 'PASTE_YOUR_CONVERSATION_ID_HERE';
  fetch(`/api/conversations/${conversationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title: 'Updated Title' })
  })
    .then(r => r.json())
    .then(console.log);
  ```
- **Expected:** Updated conversation object

---

### Step 3: Test Messages API

#### 3.1 Create Message
- **Paste conversation ID** from Step 2.2
- **Type message:** "Hello, this is my first message!"
- **Click:** "POST /api/messages"
- **Expected:** `{ message: { id: "...", content: "...", role: "user", ... } }`
- **Status:** `201 Created`
- **📝 Copy the message ID!**

#### 3.2 Create Another Message
- **Same conversation ID**
- **Type:** "This is my second message"
- **Click:** "POST /api/messages" again
- **Expected:** Another message created

#### 3.3 Get Conversation with Messages
- **Paste conversation ID**
- **Click:** "GET /api/conversations/[id]"
- **Expected:** Conversation with `messages` array containing both messages
- **Status:** `200 OK`

#### 3.4 Get Specific Message
- **In browser console, run:**
  ```javascript
  const messageId = 'PASTE_YOUR_MESSAGE_ID_HERE';
  fetch(`/api/messages/${messageId}`, { credentials: 'include' })
    .then(r => r.json())
    .then(console.log);
  ```
- **Expected:** Full message object

---

### Step 4: Test Documents API

#### 4.1 List Documents
- **In browser console, run:**
  ```javascript
  fetch('/api/documents', { credentials: 'include' })
    .then(r => r.json())
    .then(console.log);
  ```
- **Expected:** `{ documents: [] }` or array
- **Status:** `200 OK`

#### 4.2 Create Document
- **In browser console, run:**
  ```javascript
  fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: 'Test Document',
      content: 'This is a test document content for testing the documents API.',
      source: 'test'
    })
  })
    .then(r => r.json())
    .then(console.log);
  ```
- **Expected:** `{ document: { id: "...", title: "Test Document", ... } }`
- **Status:** `201 Created`

#### 4.3 Search Documents
- **In browser console, run:**
  ```javascript
  fetch('/api/documents/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query: 'test', limit: 5 })
  })
    .then(r => r.json())
    .then(console.log);
  ```
- **Expected:** Documents matching "test"
- **Status:** `200 OK`

---

## 🎯 Full Workflow Test

Test a complete user workflow:

1. **Create a Space**
   - POST /api/spaces → Get space ID

2. **Create a Conversation**
   - POST /api/conversations → Get conversation ID

3. **Send Multiple Messages**
   - POST /api/messages (message 1)
   - POST /api/messages (message 2)
   - POST /api/messages (message 3)

4. **Get Full Conversation**
   - GET /api/conversations/[id]
   - Should show all 3 messages!

5. **Create a Document**
   - POST /api/documents

6. **Search Documents**
   - POST /api/documents/search

---

## ✅ Success Criteria

All tests should:
- ✅ Return proper HTTP status codes (200, 201)
- ✅ Return valid JSON responses
- ✅ Include proper data structure
- ✅ Show no errors in console
- ✅ Work when logged in

---

## 🐛 Troubleshooting

### "404 Not Found"
- Check that the ID is correct
- Make sure the resource exists

### "401 Unauthorized"
- Make sure you're logged in
- Check browser cookies

### "500 Internal Server Error"
- Check terminal for error messages
- Verify database connection

---

## 📊 Test Results Template

Document your test results:

```
Spaces API:
- GET /api/spaces: ✅ 200 OK
- POST /api/spaces: ✅ 201 Created
- GET /api/spaces/[id]: ✅ 200 OK

Conversations API:
- GET /api/conversations: ✅ 200 OK
- POST /api/conversations: ✅ 201 Created
...

```

---

**Ready to test?** Start with the test page and work through each endpoint! 🚀

