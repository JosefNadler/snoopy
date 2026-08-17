"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { CardData } from "@/lib/types";

interface CardItemProps {
  card: CardData;
  onDelete: (cardId: string) => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid="card"
      className={`group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-navy">{card.title}</p>
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onDelete(card.id)}
          className="shrink-0 rounded p-1 text-gray-text opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {card.details && (
        <p className="line-clamp-3 mt-1 text-sm text-gray-text">{card.details}</p>
      )}
    </div>
  );
}
