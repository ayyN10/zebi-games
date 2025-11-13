"use client";

import { useState } from 'react';
import type { BaseMiniGameProps, MiniGameResult } from '../types';

/**
 * Mini-jeu : J'annonce
 * Chaque joueur annonce quelque chose, et les autres boivent si ça les concerne
 */
function AnnounceGame({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  const [step, setStep] = useState<'intro' | 'playing'>('intro');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drinkingPlayers, setDrinkingPlayers] = useState<Set<string>>(new Set());

  const currentPlayer = players[currentPlayerIndex];

  const handlePlayerDrinks = (playerId: string) => {
    const newSet = new Set(drinkingPlayers);
    if (newSet.has(playerId)) {
      newSet.delete(playerId);
    } else {
      newSet.add(playerId);
    }
    setDrinkingPlayers(newSet);
  };

  const handleNext = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setDrinkingPlayers(new Set());
    } else {
      // Fin du jeu
      const results: MiniGameResult[] = [];
      players.forEach(player => {
        // Logique simplifiée : chaque joueur pourrait avoir bu pendant le jeu
        // Dans une vraie implémentation, on tracking le nombre de fois
        results.push({
          playerId: player.id,
          sipsToAdd: 0, // Pas de pénalité fixe, juste pour l'ambiance
          reason: 'A participé au jeu J\'annonce',
          type: 'neutral',
        });
      });
      onComplete(results);
    }
  };

  const announcements = [
    "J'annonce que je n'ai jamais...",
    "J'annonce que je préfère...",
    "J'annonce que tout le monde qui...",
    "J'annonce que les gens qui aiment...",
    "J'annonce que ceux qui ont déjà...",
  ];

  if (step === 'intro') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              📢 J&apos;annonce
            </h1>
            <p className="text-center text-lg text-slate-700 mb-6">
              Chaque joueur fait une annonce. Les autres boivent si ça les concerne !
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <p className="text-sm text-slate-700 mb-2">
                <strong>Exemples d&apos;annonces :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li>&quot;J&apos;annonce que tous ceux qui portent du bleu boivent&quot;</li>
                <li>&quot;J&apos;annonce que les personnes qui ont un animal boivent&quot;</li>
                <li>&quot;J&apos;annonce que ceux nés en été boivent&quot;</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep('playing')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
              >
                Commencer
              </button>
              <button
                onClick={onSkip}
                className="bg-slate-400 text-white px-6 py-3 rounded-lg hover:bg-slate-500"
              >
                Passer
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'playing') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-500 mb-2">
                Joueur {currentPlayerIndex + 1} sur {players.length}
              </p>
              <h2 className="text-3xl font-bold mb-4">
                C&apos;est à <span className="text-indigo-600">{currentPlayer.name}</span>
              </h2>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 mb-6 border border-indigo-200">
              <p className="text-center text-lg font-medium text-slate-800">
                Fais une annonce ! 📢
              </p>
              <p className="text-center text-sm text-slate-600 mt-2">
                Exemple : &quot;{announcements[currentPlayerIndex % announcements.length]}&quot;
              </p>
            </div>

            <div className="mb-6">
              <p className="text-center text-slate-700 mb-4">
                Qui doit boire ?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {players
                  .filter(p => p.id !== currentPlayer.id)
                  .map(player => (
                    <button
                      key={player.id}
                      onClick={() => handlePlayerDrinks(player.id)}
                      className={`p-4 rounded-lg font-medium transition-colors ${
                        drinkingPlayers.has(player.id)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {player.name}
                      {drinkingPlayers.has(player.id) && ' 🍺'}
                    </button>
                  ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                {currentPlayerIndex < players.length - 1 ? 'Joueur suivant' : 'Terminer'}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default AnnounceGame;
