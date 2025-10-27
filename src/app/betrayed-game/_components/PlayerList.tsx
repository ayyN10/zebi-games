"use client";

import type { Player } from "../../players/_lib/usePlayers";

export default function PlayerList({
  players,
  onAddSips,
  onRemoveSips,
}: {
  players: Player[];
  onAddSips?: (id: string, amount: number) => void;
  onRemoveSips?: (id: string, amount: number) => void;
}) {
  if (players.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <p className="text-center text-slate-600">
          Aucun joueur ajouté. Rendez-vous sur la page{" "}
          <a href="/players" className="text-indigo-600 hover:underline font-medium">
            Joueurs
          </a>
          {" "}pour en ajouter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-lg p-6 border border-green-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        👥 Joueurs ({players.length})
      </h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-green-200"
          >
            <div className="flex items-center gap-2">
              {player.avatar ? (
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <span className="text-sm font-semibold text-slate-500">
                    {player.name[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
              )}
              <span className="font-medium text-slate-800">{player.name}</span>
            </div>

            {/* Compteur de gorgées */}
            <div className="flex items-center gap-2">
              {onRemoveSips && (
                <button
                  onClick={() => onRemoveSips(player.id, 1)}
                  className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-bold text-sm"
                  disabled={(player.sips || 0) === 0}
                >
                  −
                </button>
              )}
              <span className="text-sm font-medium min-w-[60px] text-center">
                🍺 {player.sips || 0}
              </span>
              {onAddSips && (
                <button
                  onClick={() => onAddSips(player.id, 1)}
                  className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition font-bold text-sm"
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
