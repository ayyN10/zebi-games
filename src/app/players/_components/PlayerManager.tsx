"use client";

import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import usePlayers from "../_lib/usePlayers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
            className="text-sm px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>

      <PlayerList players={players} onDelete={removePlayer} />
    </div>
  );
}
