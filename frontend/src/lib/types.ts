export interface CardData {
  id: string;
  title: string;
  details: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columns: ColumnData[];
  cards: Record<string, CardData>;
}
