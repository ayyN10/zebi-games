"use client";

import type { Player } from "../_lib/usePlayers";

export default function PlayerList({
  players,
  onDelete,
}: {
  players: Player[];
  onDelete: (id: string) => void;
}) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
        Aucun joueur pour le moment. Ajoutez votre premier joueur.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {players.map((p) => (
        <li key={p.id} className="flex items-center justify-between px-4 py-3">
          <span className="font-medium text-slate-800">{p.name}</span>
          <button
            onClick={() => onDelete(p.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
