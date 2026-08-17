"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CardData, ColumnData } from "@/lib/types";
import CardItem from "./CardItem";
import AddCardForm from "./AddCardForm";

const DOT_COLORS = ["bg-yellow", "bg-blue", "bg-purple", "bg-navy", "bg-yellow"];

interface ColumnProps {
  column: ColumnData;
  cards: CardData[];
  index: number;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function Column({
  column,
  cards,
  index,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [title, setTitle] = useState(column.title);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function commitTitle() {
    const trimmed = title.trim();
    if (trimmed) {
      onRename(column.id, trimmed);
    } else {
      setTitle(column.title);
    }
  }

  return (
    <div
      data-testid="column"
      data-column-title={column.title}
      className="flex h-full w-72 shrink-0 flex-col rounded-xl border border-slate-200 bg-white/70 shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_COLORS[index % 5]}`} />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={commitTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          aria-label="Column title"
          className="min-w-0 flex-1 truncate rounded px-1 py-0.5 text-sm font-semibold text-navy outline-none focus:bg-slate-50"
        />
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-gray-text">
          {cards.length}
        </span>
      </div>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          data-testid="column-body"
          className={`flex flex-1 flex-col gap-2 overflow-y-auto p-3 transition-colors ${
            isOver ? "bg-blue/5" : ""
          }`}
          style={{ minHeight: 120, maxHeight: "calc(100vh - 220px)" }}
        >
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </div>
      </SortableContext>

      <div className="p-3 pt-0">
        <AddCardForm onAdd={(t, d) => onAddCard(column.id, t, d)} />
      </div>
    </div>
  );
}
