"use client";

import type { Player } from "../../players/_lib/usePlayers";

interface PlayerResult {
  player: Player;
  totalSips: number;
  details: string[];
}

interface Props {
  players: Player[];
  results: PlayerResult[];
  onContinue: () => void;
}

export default function ResultOfDistrubition({
  players,
  results,
  onContinue,
}: Props) {
  const playersToShow = results.filter(r => r.totalSips > 0);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              📊 Résultat du tour
            </h1>
            <p className="text-lg text-slate-600">
              Voici qui doit boire ! 🍺
            </p>
          </header>

          <div className="space-y-4 mb-8">
            {playersToShow.length === 0 ? (
              <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xl font-medium text-green-800">
                  🎉 Personne ne boit ce tour-ci !
                </p>
              </div>
            ) : (
              playersToShow.map(({ player, totalSips, details }) => (
                <div
                  key={player.id}
                  className="bg-white rounded-lg p-6 border-2 border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {player.avatar ? (
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="h-12 w-12 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <span className="text-xl font-semibold text-slate-500">
                            {player.name[0]?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-slate-900">
                        {player.name}
                      </h3>
                    </div>
                    <div className="bg-indigo-100 rounded-lg px-4 py-2">
                      <span className="text-2xl font-bold text-indigo-700">
                        {totalSips} 🍺
                      </span>
                    </div>
                  </div>

                  {details.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {details.map((detail, index) => (
                        <p
                          key={index}
                          className="text-sm text-slate-600 pl-4 border-l-2 border-indigo-200"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onContinue}
              className="rounded-lg bg-indigo-600 text-white px-12 py-4 text-lg font-medium hover:bg-indigo-700 transition shadow-md"
            >
              Continuer vers le mini-jeu 🎲
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
