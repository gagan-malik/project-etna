import { classifyIntent } from "@/lib/orchestration/classifier";

describe("Orchestration Classifier", () => {
  describe("classifyIntent", () => {
    it("should classify research intent", () => {
      expect(classifyIntent("How does X work?")).toBe("research");
      expect(classifyIntent("Best practice for React")).toBe("research");
      expect(classifyIntent("Any CVE for this package?")).toBe("research");
      expect(classifyIntent("What's the recommended way to do this?")).toBe("research");
    });

    it("should classify architect intent", () => {
      expect(classifyIntent("Design the API for user auth")).toBe("architect");
      expect(classifyIntent("API contract for this service")).toBe("architect");
      expect(classifyIntent("Data model for users")).toBe("architect");
    });

    it("should classify implement intent", () => {
      expect(classifyIntent("Implement user login")).toBe("implement");
      expect(classifyIntent("Add endpoint for users")).toBe("implement");
      expect(classifyIntent("Fix the bug in this function")).toBe("implement");
      expect(classifyIntent("Refactor this module")).toBe("implement");
    });

    it("should classify review intent", () => {
      expect(classifyIntent("Review for security")).toBe("review");
      expect(classifyIntent("Is this ready for production?")).toBe("review");
      expect(classifyIntent("Suggest improvements")).toBe("review");
    });

    it("should classify docs intent", () => {
      expect(classifyIntent("Document this API")).toBe("docs");
      expect(classifyIntent("Update README")).toBe("docs");
      expect(classifyIntent("Add runbook for deployment")).toBe("docs");
    });

    it("should classify accessibility intent", () => {
      expect(classifyIntent("Make this accessible")).toBe("accessibility");
      expect(classifyIntent("Add keyboard support")).toBe("accessibility");
      expect(classifyIntent("Review for a11y")).toBe("accessibility");
    });

    it("should return general for empty or unmatched input", () => {
      expect(classifyIntent("")).toBe("general");
      expect(classifyIntent("   ")).toBe("general");
      expect(classifyIntent("Hello world")).toBe("general");
    });
  });
});
