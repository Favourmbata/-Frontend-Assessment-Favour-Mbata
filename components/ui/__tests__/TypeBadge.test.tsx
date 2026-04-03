import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypeBadge } from "@/components/ui/TypeBadge";

describe("TypeBadge", () => {
  it("renders the type name capitalized", () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText("Fire")).toBeInTheDocument();
  });

  it("renders hyphenated types formatted correctly", () => {
    render(<TypeBadge type="special-attack" />);
    expect(screen.getByText("Special Attack")).toBeInTheDocument();
  });

  it("applies sm size classes when size=sm", () => {
    const { container } = render(<TypeBadge type="water" size="sm" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("text-xs");
  });

  it("applies md size classes by default", () => {
    const { container } = render(<TypeBadge type="grass" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("text-sm");
  });

  it("applies a type-specific color class", () => {
    const { container } = render(<TypeBadge type="fire" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-orange-500");
  });

  it("falls back gracefully for unknown types", () => {
    const { container } = render(<TypeBadge type="unknown-type" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-gray-400");
  });
});
