"use client";

import { useState } from "react";

export default function PlayerForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <label htmlFor="player-name" className="sr-only">Nom du joueur</label>
      <input
        id="player-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du joueur"
        className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 text-white px-4 py-2.5 font-medium hover:bg-indigo-700 transition"
      >
        Ajouter
      </button>
    </form>
  );
}
