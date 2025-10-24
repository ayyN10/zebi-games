"use client";

import { useState } from "react";
import type { Game } from "../_lib/rawg";
import { isCorrectGuess, findSuggestions } from "../_lib/game-matcher";

const MAX_ATTEMPTS = 4;
const TOTAL_BLOCKS = 9;

export default function GuessGame({ game }: { game: Game }) {
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showInput, setShowInput] = useState(true);
  // Array de booleans: true = bloc blurré, false = bloc révélé
  const [blocksBlurred, setBlocksBlurred] = useState<boolean[]>(
    Array(TOTAL_BLOCKS).fill(true)
  );

  const handleInputChange = (value: string) => {
    setGuess(value);

    if (value.length >= 2) {
      setSuggestions(findSuggestions(value, 5));
    } else {
      setSuggestions([]);
    }
  };

  const removeRandomBlock = () => {
    const blurredIndices = blocksBlurred
      .map((isBlurred, index) => (isBlurred ? index : -1))
      .filter((i) => i !== -1);

    if (blurredIndices.length === 0) return;

    const randomIndex =
      blurredIndices[Math.floor(Math.random() * blurredIndices.length)];
    const newBlocks = [...blocksBlurred];
    newBlocks[randomIndex] = false;
    setBlocksBlurred(newBlocks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (attempts >= MAX_ATTEMPTS) return;

    if (isCorrectGuess(guess, game.name)) {
      setMessage(
        `🎉 Correct en ${attempts + 1} tentative${
          attempts > 0 ? "s" : ""
        } !`
      );
      setRevealed(true);
      setSuggestions([]);
      setShowInput(false);
      setBlocksBlurred(Array(TOTAL_BLOCKS).fill(false));
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Enlève le blur d'un bloc aléatoire
      removeRandomBlock();

      if (newAttempts >= MAX_ATTEMPTS) {
        setMessage(`❌ Perdu ! C'était "${game.name}"`);
        setRevealed(true);
        setShowInput(false);
        setSuggestions([]);
        setBlocksBlurred(Array(TOTAL_BLOCKS).fill(false));
      } else {
        setMessage(
          `❌ Essaie encore (${
            MAX_ATTEMPTS - newAttempts
          } tentative${
            MAX_ATTEMPTS - newAttempts > 1 ? "s" : ""
          } restante${
            MAX_ATTEMPTS - newAttempts > 1 ? "s" : ""
          })`
        );
      }
    }
    setGuess("");
  };

  const selectSuggestion = (suggestion: string) => {
    setGuess(suggestion);
    setSuggestions([]);
  };

  const visibleBlocksCount = blocksBlurred.filter((b) => !b).length;

  return (
    <div className="space-y-6">
      {/* Game Image with 9 blocks overlay */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 shadow-lg">
        {game.background_image ? (
          <>
            <img
              src={game.background_image}
              alt="Guess this game"
              className="h-full w-full object-cover"
            />
            {/* Grid overlay avec 9 blocs */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {blocksBlurred.map((isBlurred, i) => (
                <div
                  key={i}
                  className={`border-none transition-all duration-500 ${
                    isBlurred
                      ? "backdrop-blur-xl"
                      : "bg-transparent backdrop-blur-none pointer-events-none"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
            Pas d'image disponible
          </div>
        )}
      </div>

      {/* Game Name (revealed or hidden) */}
      <div className="text-center">
        {revealed ? (
          <h2 className="text-2xl font-bold text-slate-900">{game.name}</h2>
        ) : (
          <div className="space-y-2">
            <p className="text-lg text-slate-600">Devinez le jeu !</p>
            <p className="text-sm text-slate-500">
              Tentatives : {attempts} / {MAX_ATTEMPTS} • Blocs révélés :{" "}
              {visibleBlocksCount} / {TOTAL_BLOCKS}
            </p>
          </div>
        )}
      </div>

      {/* Guess Form with Autocomplete */}
      {showInput && !revealed && (
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                value={guess}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Tapez le nom du jeu..."
                className="w-full rounded-lg border border-slate-200 bg-white text-black px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                autoComplete="off"
                disabled={attempts >= MAX_ATTEMPTS}
              />

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition text-slate-800 border-b border-slate-100 last:border-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={attempts >= MAX_ATTEMPTS || !guess.trim()}
              className="rounded-lg bg-indigo-600 text-white px-4 py-2.5 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vérifier
            </button>
          </form>
        </div>
      )}

      {/* Message */}
      {message && (
        <p
          className={`text-center font-medium ${
            revealed && attempts < MAX_ATTEMPTS
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Reload Button */}
      {revealed && (
        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-lg bg-slate-600 text-white px-4 py-2.5 font-medium hover:bg-slate-700 transition"
        >
          Nouveau jeu
        </button>
      )}
    </div>
  );
}
