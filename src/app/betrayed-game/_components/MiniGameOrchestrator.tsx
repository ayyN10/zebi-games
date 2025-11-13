"use client";

import type { Player } from '../../players/_lib/usePlayers';
import type { MiniGameType, MiniGameResult } from '../_lib/minigames/types';
import { miniGameRegistry } from '../_lib/minigames/registry';

interface Props {
  miniGameType: MiniGameType;
  players: Player[];
  currentRound: number;
  onComplete: (results?: MiniGameResult[]) => void;
  onSkip: () => void;
}

/**
 * Orchestrateur de mini-jeux
 * Charge dynamiquement le composant approprié selon le type de mini-jeu
 */
export default function MiniGameOrchestrator({
  miniGameType,
  players,
  currentRound,
  onComplete,
  onSkip,
}: Props) {
  // Gérer le cas "none" (pas de mini-jeu)
  if (miniGameType === 'none') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">⏭️ Pas de mini-jeu</h2>
            <p className="text-lg text-slate-700 mb-6">
              On passe directement au tour suivant !
            </p>
            <button
              onClick={() => onComplete([])}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Tour suivant
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Récupérer la définition du mini-jeu depuis le registre
  const gameDefinition = miniGameRegistry.get(miniGameType);

  if (!gameDefinition) {
    console.error(`Mini-jeu inconnu: ${miniGameType}`);
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ❌ Erreur
            </h2>
            <p className="text-slate-700 mb-6">
              Le mini-jeu &quot;{miniGameType}&quot; n&apos;est pas disponible.
            </p>
            <button
              onClick={onSkip}
              className="bg-slate-600 text-white px-8 py-3 rounded-lg hover:bg-slate-700 font-medium"
            >
              Passer
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Récupérer le composant du mini-jeu
  const MiniGameComponent = gameDefinition.component;

  // Rendre le composant avec les props appropriées
  return (
    <MiniGameComponent
      players={players}
      currentRound={currentRound}
      onComplete={onComplete}
      onSkip={onSkip}
    />
  );
}
