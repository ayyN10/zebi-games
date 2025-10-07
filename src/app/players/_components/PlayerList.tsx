"use client";

import type { Player } from "../_lib/usePlayers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_AVATAR = "/images/default-avatar.png"; // dans /public/images

export default function PlayerList({
  players,
  onDelete,
}: {
  players: Player[];
  onDelete: (id: string) => void;
}) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
        Aucun joueur pour le moment. Ajoutez votre premier joueur.
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 items-center">
      {players.map((p) => {
        const src = p.avatar?.trim() ? p.avatar : DEFAULT_AVATAR;
        return (
          <div key={p.id} className="flex items-center justify-center flex-col py-2 px-4 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition">
            <div>
              <img
                src={src}
                alt={p.name}
                className="h-12 w-12 rounded-full object-cover bg-slate-200"
                onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
              />
            </div>
            <span className="font-medium text-slate-800">{p.name}</span>
            <button
              onClick={() => onDelete(p.id)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
