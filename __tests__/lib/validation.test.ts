import {
  sanitizeString,
  validateEmail,
  validateFileType,
  validateFileSize,
  validateInput,
  conversationSchema,
  messageSchema,
} from "@/lib/validation";

describe("Validation Utilities", () => {
  describe("sanitizeString", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeString("javascript:alert('xss')")).toBe("alert('xss')");
    });

    it("should trim whitespace", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validateFileType", () => {
    it("should validate allowed file types", () => {
      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      expect(validateFileType(file, ["application/pdf", "image/png"])).toBe(true);
    });

    it("should reject disallowed file types", () => {
      const file = new File(["content"], "test.exe", { type: "application/x-msdownload" });
      expect(validateFileType(file, ["application/pdf"])).toBe(false);
    });
  });

  describe("validateFileSize", () => {
    it("should validate file size", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      Object.defineProperty(file, "size", { value: 1024 });
      expect(validateFileSize(file, 2048)).toBe(true);
    });

    it("should reject oversized files", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      Object.defineProperty(file, "size", { value: 2048 });
      expect(validateFileSize(file, 1024)).toBe(false);
    });
  });

  describe("validateInput", () => {
    it("should validate conversation schema", () => {
      const result = validateInput(conversationSchema, {
        title: "Test Conversation",
        spaceId: "space-123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Test Conversation");
      }
    });

    it("should reject invalid conversation data", () => {
      const result = validateInput(conversationSchema, {
        title: "a".repeat(300), // Too long
      });
      expect(result.success).toBe(false);
    });

    it("should validate message schema", () => {
      const result = validateInput(messageSchema, {
        content: "Hello, world!",
        conversationId: "conv-123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty message content", () => {
      const result = validateInput(messageSchema, {
        content: "",
        conversationId: "conv-123",
      });
      expect(result.success).toBe(false);
    });
  });
});

