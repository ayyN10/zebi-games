"use client";

import { useState } from "react";
import type { Game } from "../_lib/rawg";

export default function GuessGame({ game }: { game: Game }) {
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = guess.trim().toLowerCase();
    const gameName = game.name.toLowerCase();

    if (trimmed === gameName) {
      setMessage("🎉 Correct !");
      setRevealed(true);
    } else {
      setMessage("❌ Essaie encore");
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 shadow-lg">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt="Guess this game"
            className={`h-full w-full object-cover transition-all duration-300 ${
              revealed ? "" : "blur-xl"
            }`}
          />
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
          <p className="text-lg text-slate-600">Devinez le jeu !</p>
        )}
      </div>

      {/* Guess Form */}
      {!revealed && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Entrez le nom du jeu"
            className="rounded-lg border border-slate-200 bg-white text-black px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 text-white px-4 py-2.5 font-medium hover:bg-indigo-700 transition"
          >
            Vérifier
          </button>
        </form>
      )}

      {/* Message */}
      {message && (
        <p className={`text-center font-medium ${
          revealed ? "text-green-600" : "text-red-600"
        }`}>
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
