"use client";

import { useState } from "react";

export default function SettingGame() {
  const [numTours, setNumTours] = useState(1);
  const [sipsPerTurn, setSipsPerTurn] = useState(1);

  return (
    <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        ⚙️ Configuration de la partie
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Nombre de tours */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-slate-800">
            Nombre de tours
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNumTours(Math.max(1, numTours - 1))}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={numTours}
              onChange={(e) => setNumTours(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded border border-purple-200 px-3 py-2 text-center font-medium"
              min="1"
            />
            <button
              onClick={() => setNumTours(numTours + 1)}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Gorgées par tour */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-slate-800">
            Gorgées distribuées par tour
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSipsPerTurn(Math.max(1, sipsPerTurn - 1))}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={sipsPerTurn}
              onChange={(e) => setSipsPerTurn(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded border border-purple-200 px-3 py-2 text-center font-medium"
              min="1"
            />
            <button
              onClick={() => setSipsPerTurn(sipsPerTurn + 1)}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-4">
        💡 Résumé : {numTours} tour{numTours > 1 ? "s" : ""} × {sipsPerTurn} gorgée{sipsPerTurn > 1 ? "s" : ""} par tour
      </p>
    </div>
  );
}
