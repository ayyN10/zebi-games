"use client";

interface Props {
  numTours: number;
  sipsPerTurn: number;
  onNumToursChange: (value: number) => void;
  onSipsPerTurnChange: (value: number) => void;
}

export default function SettingGame({
  numTours,
  sipsPerTurn,
  onNumToursChange,
  onSipsPerTurnChange,
}: Props) {
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
              onClick={() => onNumToursChange(Math.max(1, numTours - 1))}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={numTours}
              onChange={(e) => onNumToursChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded border border-purple-200 px-3 py-2 text-center font-medium"
              min="1"
            />
            <button
              onClick={() => onNumToursChange(numTours + 1)}
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
              onClick={() => onSipsPerTurnChange(Math.max(1, sipsPerTurn - 1))}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={sipsPerTurn}
              onChange={(e) => onSipsPerTurnChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded border border-purple-200 px-3 py-2 text-center font-medium"
              min="1"
            />
            <button
              onClick={() => onSipsPerTurnChange(sipsPerTurn + 1)}
              className="w-8 h-8 rounded bg-purple-200 hover:bg-purple-300 transition font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
