"use client";

import { useState } from 'react';
import type { BaseMiniGameProps, MiniGameResult } from '../types';

/**
 * Mini-jeu : Le Traître Unique
 * Un seul joueur distribue toutes les gorgées secrètement.
 * Les autres doivent deviner qui c'est !
 */
function UniqueTraitorGame({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  const [step, setStep] = useState<'intro' | 'select-traitor' | 'vote' | 'reveal'>('intro');
  const [traitorId, setTraitorId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Map<string, string>>(new Map()); // voterId -> accusedId
  const [sipsAmount, setSipsAmount] = useState(3);

  const handleTraitorSelection = (playerId: string) => {
    setTraitorId(playerId);
    setStep('vote');
  };

  const handleVote = (voterId: string, accusedId: string) => {
    setVotes(new Map(votes.set(voterId, accusedId)));
  };

  const handleReveal = () => {
    if (!traitorId) return;

    const results: MiniGameResult[] = [];

    // Compter les votes
    const voteCount = new Map<string, number>();
    votes.forEach((accusedId) => {
      voteCount.set(accusedId, (voteCount.get(accusedId) || 0) + 1);
    });

    // Trouver le joueur le plus accusé
    let mostAccusedId = '';
    let maxVotes = 0;
    voteCount.forEach((count, playerId) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostAccusedId = playerId;
      }
    });

    const traitor = players.find(p => p.id === traitorId);

    // Si les joueurs ont trouvé le traître
    if (mostAccusedId === traitorId) {
      results.push({
        playerId: traitorId,
        sipsToAdd: sipsAmount * 2,
        reason: `Démasqué comme le traître unique ! (×2)`,
        type: 'penalty',
      });
    } else {
      // Le traître n'a pas été trouvé
      const accusedPlayer = players.find(p => p.id === mostAccusedId);
      results.push({
        playerId: traitorId,
        sipsToAdd: 0,
        reason: `A réussi à rester caché comme traître !`,
        type: 'neutral',
      });

      // Tous les autres boivent
      players.forEach(player => {
        if (player.id !== traitorId) {
          results.push({
            playerId: player.id,
            sipsToAdd: sipsAmount,
            reason: `N'a pas trouvé le traître unique`,
            type: 'penalty',
          });
        }
      });
    }

    setStep('reveal');
    setTimeout(() => onComplete(results), 3000);
  };

  const otherPlayers = players.filter(p => traitorId ? p.id !== traitorId : true);

  if (step === 'intro') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              🎭 Le Traître Unique
            </h1>
            <p className="text-center text-lg text-slate-700 mb-6">
              Un joueur va secrètement distribuer {sipsAmount} gorgées.
              Les autres doivent deviner qui c&apos;est !
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
              <p className="text-sm text-slate-700">
                <strong>Règles :</strong> Le traître distribue les gorgées en secret.
                Si les joueurs le trouvent, il boit double. Sinon, tous les autres boivent.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep('select-traitor')}
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

  if (step === 'select-traitor') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Qui sera le traître ? 🤫
            </h2>
            <p className="text-center text-slate-600 mb-6">
              Passez le téléphone discrètement...
            </p>

            <div className="grid gap-3">
              {players.map(player => (
                <button
                  key={player.id}
                  onClick={() => handleTraitorSelection(player.id)}
                  className="bg-slate-100 hover:bg-indigo-100 border-2 border-slate-300 hover:border-indigo-500 rounded-lg p-4 transition-colors"
                >
                  <span className="font-medium text-lg">{player.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'vote') {
    const allVoted = otherPlayers.every(p => votes.has(p.id));

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Qui est le traître ? 🕵️
            </h2>
            <p className="text-center text-slate-600 mb-6">
              Chaque joueur vote (sauf le traître)
            </p>

            <div className="space-y-6">
              {otherPlayers.map(voter => (
                <div key={voter.id} className="border-2 border-slate-200 rounded-lg p-4">
                  <p className="font-bold mb-3 text-center">
                    {voter.name} accuse :
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {players.map(accused => (
                      <button
                        key={accused.id}
                        onClick={() => handleVote(voter.id, accused.id)}
                        disabled={accused.id === voter.id}
                        className={`p-3 rounded-lg font-medium transition-colors ${
                          votes.get(voter.id) === accused.id
                            ? 'bg-indigo-600 text-white'
                            : accused.id === voter.id
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {accused.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleReveal}
                disabled={!allVoted}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Révéler les résultats
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'reveal') {
    const traitor = players.find(p => p.id === traitorId);
    const voteCount = new Map<string, number>();
    votes.forEach((accusedId) => {
      voteCount.set(accusedId, (voteCount.get(accusedId) || 0) + 1);
    });

    let mostAccusedId = '';
    let maxVotes = 0;
    voteCount.forEach((count, playerId) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostAccusedId = playerId;
      }
    });

    const found = mostAccusedId === traitorId;

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              {found ? '🎉 Traître démasqué !' : '😈 Le traître a gagné !'}
            </h2>
            <p className="text-xl mb-6">
              Le traître était : <strong>{traitor?.name}</strong>
            </p>
            {found ? (
              <p className="text-lg text-slate-700">
                {traitor?.name} boit {sipsAmount * 2} gorgées ! (×2)
              </p>
            ) : (
              <p className="text-lg text-slate-700">
                Tous les autres boivent {sipsAmount} gorgées !
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default UniqueTraitorGame;
