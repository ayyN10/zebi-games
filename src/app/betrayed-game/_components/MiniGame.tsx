"use client";

import type { MiniGameType } from "../_lib/useGameManager";
import type { Player } from "../../players/_lib/usePlayers";

interface Props {
  miniGameType: MiniGameType;
  players: Player[];
  currentRound: number;
  onComplete: () => void;
  onSkip: () => void;
}

export default function MiniGame({
  miniGameType,
  players,
  currentRound,
  onComplete,
  onSkip,
}: Props) {
  if (miniGameType === 'none') {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Pas de mini-jeu ce tour-ci !</h2>
        <button
          onClick={onComplete}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Tour suivant
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            🎲 Mini-jeu : {getMiniGameTitle(miniGameType)}
          </h1>

          <div className="space-y-6">
            <p className="text-center text-lg text-slate-700">
              {getMiniGameDescription(miniGameType)}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onComplete}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Mini-jeu terminé
              </button>
              <button
                onClick={onSkip}
                className="bg-slate-400 text-white px-8 py-3 rounded-lg hover:bg-slate-500 font-medium"
              >
                Passer
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getMiniGameTitle(type: MiniGameType): string {
  switch (type) {
    case 'unique-traitor':
      return 'Le Traître Unique';
    case 'announce':
      return "J'annonce";
    default:
      return 'Aucun';
  }
}

function getMiniGameDescription(type: MiniGameType): string {
  switch (type) {
    case 'unique-traitor':
      return 'Un seul joueur distribue toutes les gorgées. Les autres doivent deviner qui c\'est !';
    case 'announce':
      return 'Chaque joueur annonce quelque chose, et les autres boivent si ça les concerne !';
    default:
      return '';
  }
}
