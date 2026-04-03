import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatBar } from "@/components/ui/StatBar";

describe("StatBar", () => {
  it("renders the stat value", () => {
    render(<StatBar name="hp" value={45} />);
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("renders the formatted stat name", () => {
    render(<StatBar name="hp" value={45} />);
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("renders special-attack as Sp.ATK", () => {
    render(<StatBar name="special-attack" value={80} />);
    expect(screen.getByText("Sp.ATK")).toBeInTheDocument();
  });

  it("sets correct aria attributes on the progress bar", () => {
    render(<StatBar name="attack" value={100} max={255} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "255");
  });

  it("applies green color for high stats (>=70%)", () => {
    const { container } = render(<StatBar name="speed" value={180} max={255} />);
   
    const fill = container.querySelector(".bg-green-500");
    expect(fill).toBeTruthy();
  });

  it("applies red color for low stats (<40%)", () => {
    const { container } = render(<StatBar name="defense" value={50} max={255} />);
    
    const fill = container.querySelector(".bg-red-400");
    expect(fill).toBeTruthy();
  });
});
