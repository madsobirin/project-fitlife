import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (className merger)", () => {
  it("should return a single class as-is", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("should merge multiple classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("should resolve Tailwind conflicts (last wins)", () => {
    // twMerge should resolve conflicting tailwind classes
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });

  it("should handle conditional classes (truthy)", () => {
    const isActive = true;
    expect(cn("base-class", isActive && "active-class")).toBe(
      "base-class active-class",
    );
  });

  it("should ignore falsy conditional classes", () => {
    const isActive = false;
    expect(cn("base-class", isActive && "active-class")).toBe("base-class");
  });

  it("should handle object syntax from clsx", () => {
    expect(cn({ "text-bold": true, "text-italic": false })).toBe("text-bold");
  });

  it("should return empty string when no valid classes provided", () => {
    expect(cn(false, undefined, null as unknown as string)).toBe("");
  });

  it("should handle array of classes", () => {
    expect(cn(["px-2", "py-2"])).toBe("px-2 py-2");
  });
});
