"use client";

import { useState, useEffect } from 'react';
import type { BaseMiniGameProps, MiniGameResult } from '../types';

/**
 * Mini-jeu : L'Imposteur
 * Un imposteur se cache parmi les joueurs. À chaque tour, tous votent pour éliminer quelqu'un.
 * L'imposteur gagne s'il reste jusqu'à la fin, les innocents gagnent s'ils l'éliminent.
 */
function ImpostorGame({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  const [step, setStep] = useState<'intro' | 'reveal-role' | 'discussion' | 'vote' | 'result' | 'final'>('intro');
  const [impostorId, setImpostorId] = useState<string | null>(null);
  const [currentRoleReveal, setCurrentRoleReveal] = useState(0);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<Set<string>>(new Set());
  const [roundNumber, setRoundNumber] = useState(1);
  const [votes, setVotes] = useState<Map<string, string>>(new Map());
  const [discussionTime, setDiscussionTime] = useState(30);

  const activePlayers = players.filter(p => !eliminatedPlayers.has(p.id));
  const impostorAlive = impostorId ? !eliminatedPlayers.has(impostorId) : true;

  useEffect(() => {
    if (step === 'discussion' && discussionTime > 0) {
      const timer = setTimeout(() => setDiscussionTime(discussionTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, discussionTime]);

  const startGame = () => {
    // Sélectionner aléatoirement l'imposteur
    const randomIndex = Math.floor(Math.random() * players.length);
    setImpostorId(players[randomIndex].id);
    setStep('reveal-role');
  };

  const handleRoleReveal = () => {
    if (currentRoleReveal < players.length - 1) {
      setCurrentRoleReveal(currentRoleReveal + 1);
    } else {
      setStep('discussion');
    }
  };

  const handleVote = (voterId: string, accusedId: string) => {
    setVotes(new Map(votes.set(voterId, accusedId)));
  };

  const handleRevealVotes = () => {
    // Compter les votes
    const voteCount = new Map<string, number>();
    votes.forEach((accusedId) => {
      voteCount.set(accusedId, (voteCount.get(accusedId) || 0) + 1);
    });

    // Trouver le joueur le plus voté
    let eliminatedId = '';
    let maxVotes = 0;
    voteCount.forEach((count, playerId) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedId = playerId;
      }
    });

    if (eliminatedId) {
      setEliminatedPlayers(new Set(eliminatedPlayers).add(eliminatedId));
    }

    setVotes(new Map());
    setStep('result');

    // Vérifier les conditions de victoire
    setTimeout(() => {
      const newActivePlayers = players.filter(p => p.id !== eliminatedId && !eliminatedPlayers.has(p.id));

      if (eliminatedId === impostorId) {
        // Les innocents ont gagné
        setStep('final');
      } else if (newActivePlayers.length <= 2) {
        // L'imposteur a gagné (trop peu d'innocents)
        setStep('final');
      } else {
        // Continuer le jeu
        setRoundNumber(roundNumber + 1);
        setDiscussionTime(30);
        setStep('discussion');
      }
    }, 3000);
  };

  const handleFinish = () => {
    const results: MiniGameResult[] = [];
    const impostorWon = impostorAlive && activePlayers.length <= 2;

    players.forEach(player => {
      if (player.id === impostorId) {
        results.push({
          playerId: player.id,
          sipsToAdd: impostorWon ? 0 : 5,
          reason: impostorWon
            ? 'L\'imposteur a gagné ! Distribue 5 gorgées'
            : 'L\'imposteur a perdu ! Boit 5 gorgées',
          type: impostorWon ? 'reward' : 'penalty',
        });
      } else if (!eliminatedPlayers.has(player.id)) {
        results.push({
          playerId: player.id,
          sipsToAdd: impostorWon ? 3 : 0,
          reason: impostorWon
            ? 'N\'a pas trouvé l\'imposteur'
            : 'A démasqué l\'imposteur !',
          type: impostorWon ? 'penalty' : 'reward',
        });
      } else {
        results.push({
          playerId: player.id,
          sipsToAdd: 2,
          reason: 'Éliminé par erreur',
          type: 'penalty',
        });
      }
    });

    onComplete(results);
  };

  if (step === 'intro') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              🕵️ L&apos;Imposteur
            </h1>
            <p className="text-center text-lg text-slate-700 mb-6">
              Un imposteur se cache parmi vous. Trouvez-le avant qu&apos;il ne soit trop tard !
            </p>

            <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
              <p className="text-sm text-slate-700 mb-2">
                <strong>Règles :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li>Un joueur est secrètement désigné comme l&apos;imposteur</li>
                <li>Chaque tour : discussion puis vote pour éliminer quelqu&apos;un</li>
                <li>Les innocents gagnent s&apos;ils éliminent l&apos;imposteur</li>
                <li>L&apos;imposteur gagne s&apos;il reste jusqu&apos;à la fin</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
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

  if (step === 'reveal-role') {
    const currentPlayer = players[currentRoleReveal];
    const isImpostor = currentPlayer.id === impostorId;

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              {currentPlayer.name}, regarde ton rôle 👀
            </h2>
            <p className="text-center text-slate-600 mb-8">
              Joueur {currentRoleReveal + 1} sur {players.length}
            </p>

            <div className={`rounded-lg p-8 mb-6 border-2 text-center ${
              isImpostor
                ? 'bg-red-100 border-red-500'
                : 'bg-green-100 border-green-500'
            }`}>
              <p className="text-4xl mb-4">{isImpostor ? '🔪' : '👤'}</p>
              <p className="text-2xl font-bold">
                Tu es {isImpostor ? "L'IMPOSTEUR" : "INNOCENT"}
              </p>
              {isImpostor && (
                <p className="text-sm mt-2 text-red-700">
                  Cache ton rôle et fais éliminer les innocents !
                </p>
              )}
              {!isImpostor && (
                <p className="text-sm mt-2 text-green-700">
                  Trouve l&apos;imposteur avant qu&apos;il ne soit trop tard !
                </p>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={handleRoleReveal}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
              >
                {currentRoleReveal < players.length - 1 ? 'Joueur suivant' : 'Commencer le jeu'}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'discussion') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-500 mb-2">Tour {roundNumber}</p>
              <h2 className="text-3xl font-bold mb-4">💬 Phase de discussion</h2>
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {discussionTime}s
              </div>
              <p className="text-slate-600">
                Discutez et trouvez l&apos;imposteur !
              </p>
            </div>

            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Joueurs restants : {activePlayers.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {activePlayers.map(player => (
                  <span key={player.id} className="bg-white px-3 py-1 rounded-full text-sm">
                    {player.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('vote')}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-medium"
              >
                Passer au vote
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'vote') {
    const allVoted = activePlayers.every(p => votes.has(p.id));

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              🗳️ Phase de vote
            </h2>
            <p className="text-center text-slate-600 mb-6">
              Qui voulez-vous éliminer ?
            </p>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {activePlayers.map(voter => (
                <div key={voter.id} className="border-2 border-slate-200 rounded-lg p-4">
                  <p className="font-bold mb-3 text-center">
                    {voter.name} vote pour :
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {activePlayers.map(accused => (
                      <button
                        key={accused.id}
                        onClick={() => handleVote(voter.id, accused.id)}
                        disabled={accused.id === voter.id}
                        className={`p-3 rounded-lg font-medium transition-colors ${
                          votes.get(voter.id) === accused.id
                            ? 'bg-red-600 text-white'
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
                onClick={handleRevealVotes}
                disabled={!allVoted}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Révéler les votes
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'result') {
    const lastEliminated = Array.from(eliminatedPlayers)[eliminatedPlayers.size - 1];
    const eliminatedPlayer = players.find(p => p.id === lastEliminated);
    const wasImpostor = lastEliminated === impostorId;

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              {eliminatedPlayer?.name} a été éliminé !
            </h2>
            {wasImpostor ? (
              <>
                <p className="text-6xl mb-4">🎉</p>
                <p className="text-xl text-green-600 font-bold">
                  C&apos;était l&apos;imposteur !
                </p>
              </>
            ) : (
              <>
                <p className="text-6xl mb-4">😢</p>
                <p className="text-xl text-red-600 font-bold">
                  C&apos;était un innocent...
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (step === 'final') {
    const impostorWon = impostorAlive && activePlayers.length <= 2;
    const impostor = players.find(p => p.id === impostorId);

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h1 className="text-4xl font-bold mb-6">
              {impostorWon ? '😈 L\'imposteur a gagné !' : '🎉 Les innocents ont gagné !'}
            </h1>
            <p className="text-2xl mb-6">
              L&apos;imposteur était : <strong className="text-red-600">{impostor?.name}</strong>
            </p>

            {impostorWon ? (
              <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-200">
                <p className="text-lg">
                  {impostor?.name} peut distribuer 5 gorgées !
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Les autres boivent 3 gorgées chacun
                </p>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
                <p className="text-lg">
                  {impostor?.name} boit 5 gorgées !
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Les innocents éliminés boivent 2 gorgées
                </p>
              </div>
            )}

            <button
              onClick={handleFinish}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Continuer
            </button>
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default ImpostorGame;
