"use client";

import { useState } from 'react';
import type { BaseMiniGameProps, MiniGameResult } from '../types';

/**
 * Mini-jeu : Vote Collectif
 * Les joueurs votent tous ensemble sur une question.
 * La minorité boit !
 */
function VoteGame({ players, currentRound, onComplete, onSkip }: BaseMiniGameProps) {
  const [step, setStep] = useState<'intro' | 'question' | 'vote' | 'result'>('intro');
  const [votes, setVotes] = useState<Map<string, 'oui' | 'non'>>(new Map());
  const [currentQuestion, setCurrentQuestion] = useState('');

  const questions = [
    "Qui préfère la bière au vin ?",
    "Qui a déjà menti à ses parents cette semaine ?",
    "Qui pense gagner cette partie ?",
    "Qui a déjà été amoureux d'une personne ici présente ?",
    "Qui préfère rester chez soi plutôt que sortir ?",
    "Qui pense que l'ananas sur la pizza c'est bon ?",
  ];

  const handleStartQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setStep('question');
    setTimeout(() => setStep('vote'), 3000);
  };

  const handleVote = (playerId: string, vote: 'oui' | 'non') => {
    setVotes(new Map(votes.set(playerId, vote)));
  };

  const handleReveal = () => {
    let ouiCount = 0;
    let nonCount = 0;

    votes.forEach((vote) => {
      if (vote === 'oui') ouiCount++;
      else nonCount++;
    });

    const results: MiniGameResult[] = [];
    const minorityVote: 'oui' | 'non' | null =
      ouiCount < nonCount ? 'oui' :
      nonCount < ouiCount ? 'non' :
      null;

    if (minorityVote) {
      // La minorité boit
      votes.forEach((vote, playerId) => {
        if (vote === minorityVote) {
          results.push({
            playerId,
            sipsToAdd: 3,
            reason: 'Dans la minorité du vote',
            type: 'penalty',
          });
        }
      });
    } else {
      // Égalité : tout le monde boit
      players.forEach(player => {
        results.push({
          playerId: player.id,
          sipsToAdd: 2,
          reason: 'Égalité parfaite !',
          type: 'penalty',
        });
      });
    }

    setStep('result');
    setTimeout(() => onComplete(results), 3000);
  };

  if (step === 'intro') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              🗳️ Vote Collectif
            </h1>
            <p className="text-center text-lg text-slate-700 mb-6">
              Une question va apparaître. Votez OUI ou NON.
              La minorité boit !
            </p>

            <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
              <p className="text-sm text-slate-700">
                <strong>Règle :</strong> Si vous êtes dans la minorité, vous buvez 3 gorgées.
                En cas d&apos;égalité, tout le monde boit 2 gorgées !
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStartQuestion}
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

  if (step === 'question') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-8">
              Préparez-vous à voter ! 🤔
            </h2>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 mb-6 border-2 border-purple-300">
              <p className="text-3xl font-bold text-slate-800">
                {currentQuestion}
              </p>
            </div>
            <p className="text-slate-600">
              Réfléchissez bien... La minorité va boire !
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'vote') {
    const allVoted = players.every(p => votes.has(p.id));

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              {currentQuestion}
            </h2>
            <p className="text-center text-slate-600 mb-6">
              Votez OUI ou NON (en secret !)
            </p>

            <div className="space-y-4 mb-6">
              {players.map(player => (
                <div key={player.id} className="border-2 border-slate-200 rounded-lg p-4">
                  <p className="font-bold mb-3 text-center">{player.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleVote(player.id, 'oui')}
                      className={`p-4 rounded-lg font-medium transition-colors ${
                        votes.get(player.id) === 'oui'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 hover:bg-green-100'
                      }`}
                    >
                      ✓ OUI
                    </button>
                    <button
                      onClick={() => handleVote(player.id, 'non')}
                      className={`p-4 rounded-lg font-medium transition-colors ${
                        votes.get(player.id) === 'non'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 hover:bg-red-100'
                      }`}
                    >
                      ✗ NON
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleReveal}
                disabled={!allVoted}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Révéler les résultats
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === 'result') {
    let ouiCount = 0;
    let nonCount = 0;

    votes.forEach((vote) => {
      if (vote === 'oui') ouiCount++;
      else nonCount++;
    });

    const tie = ouiCount === nonCount;
    const minorityVote = ouiCount < nonCount ? 'oui' : 'non';

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-6">
              {tie ? '⚖️ Égalité parfaite !' : '📊 Résultats'}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 rounded-lg p-6 border-2 border-green-300">
                <p className="text-4xl font-bold text-green-600">{ouiCount}</p>
                <p className="text-sm font-medium text-slate-700">OUI</p>
              </div>
              <div className="bg-red-100 rounded-lg p-6 border-2 border-red-300">
                <p className="text-4xl font-bold text-red-600">{nonCount}</p>
                <p className="text-sm font-medium text-slate-700">NON</p>
              </div>
            </div>

            {tie ? (
              <p className="text-lg text-slate-700">
                Tout le monde boit 2 gorgées ! 🍻
              </p>
            ) : (
              <div>
                <p className="text-lg text-slate-700 mb-2">
                  La minorité (<strong>{minorityVote.toUpperCase()}</strong>) boit 3 gorgées !
                </p>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-slate-600">
                    {Array.from(votes.entries())
                      .filter(([_, vote]) => vote === minorityVote)
                      .map(([playerId]) => players.find(p => p.id === playerId)?.name)
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default VoteGame;
