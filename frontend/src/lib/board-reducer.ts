import type { BoardState, CardData } from "./types";

export type BoardAction =
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "ADD_CARD"; columnId: string; card: CardData }
  | { type: "DELETE_CARD"; cardId: string }
  | { type: "MOVE_CARD"; cardId: string; toColumnId: string; toIndex: number };

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "RENAME_COLUMN": {
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.columnId ? { ...column, title: action.title } : column
        ),
      };
    }

    case "ADD_CARD": {
      return {
        ...state,
        cards: { ...state.cards, [action.card.id]: action.card },
        columns: state.columns.map((column) =>
          column.id === action.columnId
            ? { ...column, cardIds: [...column.cardIds, action.card.id] }
            : column
        ),
      };
    }

    case "DELETE_CARD": {
      const cards = { ...state.cards };
      delete cards[action.cardId];
      return {
        ...state,
        cards,
        columns: state.columns.map((column) => ({
          ...column,
          cardIds: column.cardIds.filter((id) => id !== action.cardId),
        })),
      };
    }

    case "MOVE_CARD": {
      const fromColumn = state.columns.find((column) =>
        column.cardIds.includes(action.cardId)
      );
      if (!fromColumn) return state;

      const fromIndex = fromColumn.cardIds.indexOf(action.cardId);
      const withoutCard = fromColumn.cardIds.filter((id) => id !== action.cardId);

      // Removing the card shifts later indices down by one within the same column.
      const toIndex =
        fromColumn.id === action.toColumnId && action.toIndex > fromIndex
          ? action.toIndex - 1
          : action.toIndex;

      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.id === fromColumn.id && column.id === action.toColumnId) {
            const cardIds = [...withoutCard];
            cardIds.splice(toIndex, 0, action.cardId);
            return { ...column, cardIds };
          }
          if (column.id === fromColumn.id) {
            return { ...column, cardIds: withoutCard };
          }
          if (column.id === action.toColumnId) {
            const cardIds = [...column.cardIds];
            cardIds.splice(toIndex, 0, action.cardId);
            return { ...column, cardIds };
          }
          return column;
        }),
      };
    }

    default:
      return state;
  }
}
