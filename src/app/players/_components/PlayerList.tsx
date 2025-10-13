"use client";

import type { Player } from "../_lib/usePlayers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Helper: first letter of the name (uppercase)
const getInitial = (name: string) => (name.trim()[0]?.toUpperCase() ?? "?");

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

  async function handleDelete(p: Player) {
    try {
      const path = p.avatar?.trim();
      if (path && path.startsWith("/_images/")) {
        await fetch("/api/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        });
      }
    } catch (e) {
      console.error("Image delete failed:", e);
    } finally {
      onDelete(p.id);
    }
  }

  return (
    <div className="flex justify-center gap-4 items-center">
      {players.map((p) => {
        return (
          <div key={p.id} className="flex items-center justify-center flex-col py-2 px-4 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="relative">
              {p.avatar?.trim() ? (
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="h-12 w-12 rounded-full object-cover bg-slate-200 border border-slate-200 shadow-sm"
                  onError={(e) => { e.currentTarget.src = p.name; }}
                />
              ) : (
                <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                    <span className="text-sm font-semibold">{getInitial(p.name)}</span>
                  </div>
                </div>
              )}
            </div>
            <span className="font-medium text-slate-800">{p.name}</span>
            <button
              onClick={() => handleDelete(p)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
