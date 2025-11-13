"use client";

import { useState } from "react";
import usePlayers from "../players/_lib/usePlayers";
import PlayerList from "./_components/PlayerList";
import DistribtionSip from "./_components/DistrubitionSip";
import SettingGame from "./_components/SettingGame";
import Button from "@/components/ui/Button";
import { useGameManager } from "./_lib/useGameManager";
import MiniGameOrchestrator from "./_components/MiniGameOrchestrator";
import AccusationPhase from "./_components/AccusationPhase";
import ResultOfDistrubition from "./_components/ResultOfDistrubition";

export default function BetrayedGamePage() {
  const { players, addSips, removeSips, resetAllSips, removePlayer } = usePlayers();
  const [gameStarted, setGameStarted] = useState(false);
  const [numTours, setNumTours] = useState(1);
  const [sipsPerTurn, setSipsPerTurn] = useState(1);

  const gameManager = useGameManager({
    maxRounds: numTours,
    sipsPerRound: sipsPerTurn,
    players,
    onAddSips: addSips,
  });

  const handleStartGame = () => {
    if (players.length < 2) {
      alert("Vous devez avoir au moins 2 joueurs pour commencer !");
      return;
    }
    // Ne plus réinitialiser les gorgées au début : on garde les compteurs pendant la partie
    setGameStarted(true);
  };

  const handleEndGame = () => {
    // Réinitialiser les gorgées uniquement à la fin de la partie
    setGameStarted(false);
  };

  // Si la partie est terminée
  if (gameStarted && gameManager.isGameEnded) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">🎉 Partie terminée !</h1>
          <p className="text-xl">Bravo à tous les joueurs !</p>
          <button
            onClick={handleEndGame}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
          >
            Retour au menu
          </button>
        </div>
      </main>
    );
  }

  // Si on est dans la phase de résultats
  if (gameStarted && gameManager.currentPhase === 'results') {
    return (
      <ResultOfDistrubition
        players={players}
        results={gameManager.formattedResults}
        onContinue={gameManager.handleResultsContinue}
      />
    );
  }

  // Si on est dans la phase d'accusation
  if (gameStarted && gameManager.currentPhase === 'accusation') {
    return (
      <AccusationPhase
        players={players}
        currentAccuser={gameManager.currentAccuser}
        onAccuse={gameManager.handleAccusation}
      />
    );
  }

  // Si on est dans un mini-jeu
  if (gameStarted && gameManager.currentPhase === 'minigame') {
    return (
      <MiniGameOrchestrator
        miniGameType={gameManager.miniGameType}
        players={players}
        currentRound={gameManager.currentRound}
        onComplete={gameManager.handleMinigameComplete}
        onSkip={gameManager.handleSkipMinigame}
      />
    );
  }

  // Si la partie est lancée - phase de distribution
  if (gameStarted && gameManager.currentPhase === 'distribution') {
    return (
      <DistribtionSip
        players={players}
        currentPlayer={gameManager.currentPlayer}
        currentRound={gameManager.currentRound}
        maxRounds={numTours}
        sipsDistributed={gameManager.sipsDistributed}
        sipsPerRound={sipsPerTurn}
        onDistribute={gameManager.handleDistributeSip}
      />
    );
  }

  // Sinon, afficher les règles
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Qui veut te trahir ?
            </h1>
            <p className="text-lg text-slate-600">
              Un jeu de traîtrise et de déduction
            </p>
          </header>

          <div className="space-y-6 text-slate-700">
            {/* Règles principales */}
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                📜 Règles du jeu
              </h2>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="leading-relaxed">
                  <strong>À chaque tour</strong>, vous pouvez choisir de donner une gorgée à un autre joueur ou de boire vous-même, <strong>sans que personne ne sache</strong> qui a trahi.
                </li>
                <li className="leading-relaxed">
                  Les joueurs qui ont reçu une gorgée doivent <strong>deviner qui les a trahis</strong>.
                </li>
                <li className="leading-relaxed">
                  <strong>Si ils trouvent le traître :</strong> Le traître boit une gorgée supplémentaire pour chaque gorgée distribuée.
                </li>
                <li className="leading-relaxed">
                  <strong>Si ils se trompent :</strong> C'est eux qui boivent.
                </li>
                <li className="leading-relaxed">
                  <strong>Option sécurisée :</strong> Un joueur peut choisir de ne désigner personne et boire ses gorgées directement (pas de risque).
                </li>
              </ol>
            </div>

            {/* Mini-jeux */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                🎲 Mini-jeux
              </h2>
              <p className="leading-relaxed mb-3">
                Entre chaque tour, des mini-jeux peuvent pimenter la partie :
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li className="leading-relaxed">
                  <strong>Le traître unique :</strong> Un seul joueur distribue toutes les gorgées, les autres doivent le démasquer.
                </li>
                <li className="leading-relaxed">
                  <strong>J'annonce</strong> et bien d'autres surprises...
                </li>
                <li className="leading-relaxed text-slate-600">
                  On ne va pas tout spoiler, ce serait moins drôle ! 😉
                </li>
              </ul>
            </div>

            <PlayerList
              players={players}
              onDeletePlayer={removePlayer}
            />

            <SettingGame
              numTours={numTours}
              sipsPerTurn={sipsPerTurn}
              onNumToursChange={setNumTours}
              onSipsPerTurnChange={setSipsPerTurn}
            />

            <div className="flex justify-center items-center">
              <button
                onClick={handleStartGame}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={players.length < 2}
              >
                {players.length < 2 ? "Ajoutez au moins 2 joueurs" : "Commencer la partie !"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
