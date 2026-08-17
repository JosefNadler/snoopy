import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "./Board";

describe("Board", () => {
  it("renders the five dummy columns with their cards", () => {
    render(<Board />);

    expect(screen.getByDisplayValue("Backlog")).toBeInTheDocument();
    expect(screen.getByDisplayValue("To Do")).toBeInTheDocument();
    expect(screen.getByDisplayValue("In Progress")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Review")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Done")).toBeInTheDocument();
    expect(screen.getByText("Define product roadmap")).toBeInTheDocument();
  });

  it("renames a column", async () => {
    const user = userEvent.setup();
    render(<Board />);

    const input = screen.getByDisplayValue("Backlog");
    await user.clear(input);
    await user.type(input, "Ideas{Enter}");

    expect(screen.getByDisplayValue("Ideas")).toBeInTheDocument();
  });

  it("adds a new card to a column", async () => {
    const user = userEvent.setup();
    render(<Board />);

    const addButtons = screen.getAllByRole("button", { name: /add a card/i });
    await user.click(addButtons[0]);

    await user.type(screen.getByPlaceholderText("Card title"), "New task");
    await user.click(screen.getByRole("button", { name: /^add card$/i }));

    expect(screen.getByText("New task")).toBeInTheDocument();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<Board />);

    expect(screen.getByText("Define product roadmap")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /delete define product roadmap/i }));

    expect(screen.queryByText("Define product roadmap")).not.toBeInTheDocument();
  });
});
