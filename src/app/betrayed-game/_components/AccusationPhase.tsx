"use client";

import { useState } from "react";
import type { Player } from "../../players/_lib/usePlayers";

interface Props {
  players: Player[];
  currentAccuser: Player & { receivedSips: number };
  onAccuse: (accusedId: string | null) => void;
}

export default function AccusationPhase({
  players,
  currentAccuser,
  onAccuse,
}: Props) {
  const [selectedAccused, setSelectedAccused] = useState<string | null>(null);

  const handleAccuse = () => {
    onAccuse(selectedAccused);
    setSelectedAccused(null);
  };

  const handleDrink = () => {
    onAccuse(null);
  };

  const otherPlayers = players.filter(p => p.id !== currentAccuser.id);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {currentAccuser.name}, qui t'a trahi ? 🤔
            </h1>
            <p className="text-lg text-slate-600">
              Tu as reçu <strong>{currentAccuser.receivedSips}</strong> gorgée{currentAccuser.receivedSips > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-slate-500">
              Si tu trouves le traître, il boit double. Sinon, c'est toi qui bois !
            </p>
          </header>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {otherPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedAccused(player.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                    selectedAccused === player.id
                      ? "border-red-500 bg-red-50"
                      : "border-slate-200 bg-white hover:border-red-300"
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
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAccuse}
                disabled={!selectedAccused}
                className="rounded-lg bg-red-600 text-white px-8 py-3 font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accuser ce joueur
              </button>
              <button
                onClick={handleDrink}
                className="rounded-lg bg-slate-600 text-white px-8 py-3 font-medium hover:bg-slate-700 transition"
              >
                Boire directement (sécurisé)
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
