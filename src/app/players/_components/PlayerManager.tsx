"use client";

import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import usePlayers from "../_lib/usePlayers";

export default function PlayerManager() {
  const { players, addPlayer, removePlayer, clearPlayers } = usePlayers();

  return (
    <div className="space-y-6">
      <PlayerForm onAdd={addPlayer} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {players.length} joueur{players.length > 1 ? "s" : ""} au total
        </p>
        {players.length > 0 && (
          <button
            onClick={clearPlayers}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition"
          >
            Supprimer tout
          </button>
        )}
      </div>

      <PlayerList players={players} onDelete={removePlayer} />
    </div>
  );
}
