"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTitle } from "@/components/ui/page-title";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TestAPIPage() {
  const [results, setResults] = useState<Array<{ endpoint: string; status: string; data: any }>>([]);
  const [loading, setLoading] = useState(false);
  const [spaceName, setSpaceName] = useState("Test Workspace");
  const [conversationTitle, setConversationTitle] = useState("Test Conversation");
  const [messageContent, setMessageContent] = useState("Hello, this is a test message!");
  const [conversationId, setConversationId] = useState("");

  const addResult = (endpoint: string, status: string, data: any) => {
    setResults((prev) => [
      { endpoint, status, data: JSON.stringify(data, null, 2), timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const testEndpoint = async (method: string, endpoint: string, body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      addResult(
        `${method} ${endpoint}`,
        `${response.status} ${response.statusText}`,
        data
      );

      return { response, data };
    } catch (error: any) {
      addResult(
        `${method} ${endpoint}`,
        "Error",
        { error: error.message }
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testGetSpaces = () => testEndpoint("GET", "/api/spaces");
  const testCreateSpace = () => testEndpoint("POST", "/api/spaces", { name: spaceName });
  const testGetConversations = () => testEndpoint("GET", "/api/conversations");
  const testCreateConversation = () => testEndpoint("POST", "/api/conversations", { title: conversationTitle });
  const testGetConversation = () => {
    if (!conversationId) {
      alert("Please enter a conversation ID");
      return;
    }
    testEndpoint("GET", `/api/conversations/${conversationId}`);
  };
  const testCreateMessage = () => {
    if (!conversationId) {
      alert("Please enter a conversation ID");
      return;
    }
    testEndpoint("POST", "/api/messages", {
      conversationId,
      content: messageContent,
      role: "user",
    });
  };

  const clearResults = () => setResults([]);

  return (
    <div className="container mx-auto px-5 py-5 max-w-6xl space-y-6">
      <PageTitle
        title="API Routes Test Page"
        description="Test all API routes directly from the browser. Make sure you're logged in!"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spaces Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Spaces API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={testGetSpaces} disabled={loading} className="w-full">
                GET /api/spaces
              </Button>
              <div className="space-y-2">
                <Label htmlFor="spaceName">Space Name</Label>
                <Input
                  id="spaceName"
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  placeholder="Test Workspace"
                />
              </div>
              <Button onClick={testCreateSpace} disabled={loading} className="w-full">
                POST /api/spaces
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversations Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={testGetConversations} disabled={loading} className="w-full">
                GET /api/conversations
              </Button>
              <div className="space-y-2">
                <Label htmlFor="conversationTitle">Conversation Title</Label>
                <Input
                  id="conversationTitle"
                  value={conversationTitle}
                  onChange={(e) => setConversationTitle(e.target.value)}
                  placeholder="Test Conversation"
                />
              </div>
              <Button onClick={testCreateConversation} disabled={loading} className="w-full">
                POST /api/conversations
              </Button>
              <div className="space-y-2">
                <Label htmlFor="conversationId">Conversation ID</Label>
                <Input
                  id="conversationId"
                  value={conversationId}
                  onChange={(e) => setConversationId(e.target.value)}
                  placeholder="Enter conversation ID"
                />
              </div>
              <Button onClick={testGetConversation} disabled={loading} className="w-full">
                GET /api/conversations/[id]
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Messages API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="messageContent">Message Content</Label>
                <Input
                  id="messageContent"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Hello, this is a test message!"
                />
              </div>
              <Button onClick={testCreateMessage} disabled={loading} className="w-full">
                POST /api/messages
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={clearResults} variant="outline" className="w-full">
              Clear Results
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>💡 Tip: Copy conversation IDs from results to test nested endpoints</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Click a button above to test an API endpoint
            </p>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-semibold">{result.endpoint}</code>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          result.status.startsWith("2")
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : result.status.startsWith("4")
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      {result.data}
                    </pre>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

