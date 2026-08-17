"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddCardFormProps {
  onAdd: (title: string, details: string) => void;
}

export default function AddCardForm({ onAdd }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function close() {
    setIsOpen(false);
    setTitle("");
    setDetails("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle, details.trim());
    close();
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-blue transition hover:border-blue hover:bg-blue/5"
      >
        <Plus size={16} />
        Add a card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Card title"
        className="rounded-md border border-slate-200 px-2 py-1.5 text-sm text-navy outline-none focus:border-blue"
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
      />
      <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Details (optional)"
        rows={2}
        className="resize-none rounded-md border border-slate-200 px-2 py-1.5 text-sm text-navy outline-none focus:border-blue"
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md bg-purple px-3 py-1.5 text-sm font-medium text-white transition hover:bg-purple/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={close}
          aria-label="Cancel"
          className="rounded-md p-1.5 text-gray-text transition hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>
    </form>
  );
}
