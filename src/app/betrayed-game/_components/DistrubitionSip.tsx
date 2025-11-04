"use client";

import { useState } from "react";
import type { Player } from "../../players/_lib/usePlayers";

interface Props {
  players: Player[];
  currentPlayer: Player;
  currentRound: number;
  maxRounds: number;
  sipsDistributed: number;
  sipsPerRound: number;
  onDistribute: (targetId: string) => void;
}

export default function DistribtionSip({
  players,
  currentPlayer,
  currentRound,
  maxRounds,
  sipsDistributed,
  sipsPerRound,
  onDistribute,
}: Props) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const handleDistribute = () => {
    if (!selectedTarget) {
      alert("Sélectionnez un joueur ou vous-même !");
      return;
    }
    onDistribute(selectedTarget);
    setSelectedTarget(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Tour de {currentPlayer.name}
            </h1>
            <div className="flex justify-center gap-4 text-slate-600">
              <p className="text-lg">
                🔄 Tour <strong>{currentRound}</strong> / {maxRounds}
              </p>
              <p className="text-lg">
                🍺{" "}
                <strong>{sipsDistributed}</strong> / {sipsPerRound} distribuée
                {sipsPerRound > 1 ? "s" : ""}
              </p>
            </div>
            <p className="text-slate-600">Qui va recevoir une gorgée ? 🤔</p>
          </header>

          <div className="space-y-6">
            {/* Liste des joueurs avec sélection */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="relative">
                  <button
                    onClick={() => setSelectedTarget(player.id)}
                    className={`w-full flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                      selectedTarget === player.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="h-16 w-16 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <span className="text-2xl font-semibold text-slate-500">
                          {player.name[0]?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-slate-800">{player.name}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDistribute}
                disabled={!selectedTarget}
                className="rounded-lg bg-indigo-600 text-white px-8 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Distribuer la gorgée
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
