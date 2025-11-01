"use client";

import { useState, useEffect } from "react";
import type { Player } from "../../players/_lib/usePlayers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function GameInterface({
  players,
  onAddSips,
  onEndGame,
  onDeletePlayer,
  maxRounds,
  sipsPerRound,
}: {
  players: Player[];
  onAddSips: (id: string, amount: number) => void;
  onRemoveSips: (id: string, amount: number) => void;
  onEndGame: () => void;
  onDeletePlayer?: (id: string) => void;
  maxRounds: number;
  sipsPerRound: number;
}) {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [sipsDistributed, setSipsDistributed] = useState(0);

  // Ajuster l'index si un joueur est supprimé
  useEffect(() => {
    if (players.length === 0) {
      onEndGame();
      return;
    }
    if (currentPlayerIndex >= players.length) {
      setCurrentPlayerIndex(0);
    }
  }, [players.length, currentPlayerIndex, onEndGame]);

  const currentPlayer = players[currentPlayerIndex];

  const handleDistributeSip = () => {
    if (!selectedTarget) {
      alert("Sélectionnez un joueur ou vous-même !");
      return;
    }

    onAddSips(selectedTarget, 1);
    const newSipsDistributed = sipsDistributed + 1;
    setSipsDistributed(newSipsDistributed);

    // Si toutes les gorgées du tour sont distribuées
    if (newSipsDistributed >= sipsPerRound) {
      setSipsDistributed(0);

      // Passer au joueur suivant
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

      // Si on revient au premier joueur, passer au tour suivant
      if (nextPlayerIndex === 0) {
        const nextRound = currentRound + 1;

        // Si le nombre max de tours est atteint, fin de partie
        if (nextRound > maxRounds) {
          alert(`Partie terminée ! ${maxRounds} tours joués.`);
          onEndGame();
          return;
        }

        setCurrentRound(nextRound);
      }

      setCurrentPlayerIndex(nextPlayerIndex);
    }

    setSelectedTarget(null);
  };

  const handleDeletePlayer = (id: string, name: string) => {
    if (!onDeletePlayer) return;

    if (confirm(`Êtes-vous sûr de vouloir retirer ${name} de la partie ?`)) {
      onDeletePlayer(id);
      setSelectedTarget(null);
    }
  };

  if (!currentPlayer) {
    return null;
  }

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
                    <span className="text-sm text-slate-600">
                      🍺{" "}
                      {player.sips || 0} gorgée{(player.sips || 0) !== 1 ? "s" : ""}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDistributeSip}
                disabled={!selectedTarget}
                className="rounded-lg bg-indigo-600 text-white px-8 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Distribuer la gorgée ({sipsDistributed + 1}/{sipsPerRound})
              </button>
              <button
                onClick={onEndGame}
                className="rounded-lg bg-slate-600 text-white px-8 py-3 font-medium hover:bg-slate-700 transition"
              >
                Terminer la partie
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
