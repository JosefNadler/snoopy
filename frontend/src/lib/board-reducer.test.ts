import { describe, expect, it } from "vitest";
import { boardReducer } from "./board-reducer";
import type { BoardState } from "./types";

function makeState(): BoardState {
  return {
    cards: {
      "card-1": { id: "card-1", title: "First", details: "First details" },
      "card-2": { id: "card-2", title: "Second", details: "Second details" },
      "card-3": { id: "card-3", title: "Third", details: "Third details" },
    },
    columns: [
      { id: "col-1", title: "To Do", cardIds: ["card-1", "card-2"] },
      { id: "col-2", title: "Done", cardIds: ["card-3"] },
    ],
  };
}

describe("boardReducer", () => {
  it("renames a column", () => {
    const next = boardReducer(makeState(), {
      type: "RENAME_COLUMN",
      columnId: "col-1",
      title: "In Progress",
    });

    expect(next.columns[0].title).toBe("In Progress");
    expect(next.columns[1].title).toBe("Done");
  });

  it("adds a card to the end of a column", () => {
    const next = boardReducer(makeState(), {
      type: "ADD_CARD",
      columnId: "col-1",
      card: { id: "card-4", title: "Fourth", details: "" },
    });

    expect(next.columns[0].cardIds).toEqual(["card-1", "card-2", "card-4"]);
    expect(next.cards["card-4"]).toEqual({ id: "card-4", title: "Fourth", details: "" });
  });

  it("deletes a card from its column and the card map", () => {
    const next = boardReducer(makeState(), { type: "DELETE_CARD", cardId: "card-2" });

    expect(next.columns[0].cardIds).toEqual(["card-1"]);
    expect(next.cards["card-2"]).toBeUndefined();
  });

  it("deleting a missing card is a no-op", () => {
    const state = makeState();
    const next = boardReducer(state, { type: "DELETE_CARD", cardId: "does-not-exist" });

    expect(next.columns).toEqual(state.columns);
  });

  it("moves a card to a different column", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-2",
      toIndex: 0,
    });

    expect(next.columns[0].cardIds).toEqual(["card-2"]);
    expect(next.columns[1].cardIds).toEqual(["card-1", "card-3"]);
  });

  it("moves a card to the end of a different column", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-2",
      toIndex: 1,
    });

    expect(next.columns[1].cardIds).toEqual(["card-3", "card-1"]);
  });

  it("reorders a card within the same column, moving it later", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "card-1",
      toColumnId: "col-1",
      toIndex: 2,
    });

    expect(next.columns[0].cardIds).toEqual(["card-2", "card-1"]);
  });

  it("reorders a card within the same column, moving it earlier", () => {
    const next = boardReducer(makeState(), {
      type: "MOVE_CARD",
      cardId: "card-2",
      toColumnId: "col-1",
      toIndex: 0,
    });

    expect(next.columns[0].cardIds).toEqual(["card-2", "card-1"]);
  });

  it("moving an unknown card is a no-op", () => {
    const state = makeState();
    const next = boardReducer(state, {
      type: "MOVE_CARD",
      cardId: "does-not-exist",
      toColumnId: "col-2",
      toIndex: 0,
    });

    expect(next).toEqual(state);
  });
});
