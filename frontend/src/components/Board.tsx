"use client";

import { useReducer, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { boardReducer } from "@/lib/board-reducer";
import { initialBoardState } from "@/lib/dummy-data";
import Column from "./Column";
import CardItem from "./CardItem";

export default function Board() {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCardId(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const overId = String(over.id);
    if (cardId === overId) return;

    const overColumn = state.columns.find((column) => column.id === overId);
    if (overColumn) {
      dispatch({
        type: "MOVE_CARD",
        cardId,
        toColumnId: overColumn.id,
        toIndex: overColumn.cardIds.length,
      });
      return;
    }

    const targetColumn = state.columns.find((column) => column.cardIds.includes(overId));
    if (!targetColumn) return;

    dispatch({
      type: "MOVE_CARD",
      cardId,
      toColumnId: targetColumn.id,
      toIndex: targetColumn.cardIds.indexOf(overId),
    });
  }

  const activeCard = activeCardId ? state.cards[activeCardId] : null;

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        {state.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            index={index}
            cards={column.cardIds.map((id) => state.cards[id])}
            onRename={(columnId, title) =>
              dispatch({ type: "RENAME_COLUMN", columnId, title })
            }
            onAddCard={(columnId, title, details) =>
              dispatch({
                type: "ADD_CARD",
                columnId,
                card: { id: crypto.randomUUID(), title, details },
              })
            }
            onDeleteCard={(cardId) => dispatch({ type: "DELETE_CARD", cardId })}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="w-72 rotate-2">
            <CardItem card={activeCard} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
