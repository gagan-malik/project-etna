import { routeIntent } from "@/lib/orchestration/router";
import type { Intent } from "@/lib/orchestration/types";

describe("Orchestration Router", () => {
  describe("routeIntent", () => {
    it("should route research to single agent", () => {
      expect(routeIntent("research")).toEqual(["research"]);
    });

    it("should route architect to architect then implement", () => {
      expect(routeIntent("architect")).toEqual(["architect", "implement"]);
    });

    it("should route implement to single agent", () => {
      expect(routeIntent("implement")).toEqual(["implement"]);
    });

    it("should route review to single agent", () => {
      expect(routeIntent("review")).toEqual(["review"]);
    });

    it("should route docs to single agent", () => {
      expect(routeIntent("docs")).toEqual(["docs"]);
    });

    it("should route ux_researcher to ux_researcher then ux_designer", () => {
      expect(routeIntent("ux_researcher")).toEqual(["ux_researcher", "ux_designer"]);
    });

    it("should route ux_designer to ux_designer then implement", () => {
      expect(routeIntent("ux_designer")).toEqual(["ux_designer", "implement"]);
    });

    it("should route usability to usability then accessibility", () => {
      expect(routeIntent("usability")).toEqual(["usability", "accessibility"]);
    });

    it("should route accessibility to single agent", () => {
      expect(routeIntent("accessibility")).toEqual(["accessibility"]);
    });

    it("should route general to research", () => {
      expect(routeIntent("general")).toEqual(["research"]);
    });
  });
});
