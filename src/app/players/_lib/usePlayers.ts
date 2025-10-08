"use client";

import { useEffect, useState } from "react";

export type Player = { id: string; name: string; avatar?: string };

const STORAGE_KEY = "zebi-games:players";

export default function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlayers(JSON.parse(raw));
    } catch {}
  }, []);

  // Persister à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    } catch {}
  }, [players]);

  const addPlayer = (name: string, avatar?: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setPlayers((prev) => [...prev, { id, name: name.trim(), avatar }]);
  };

  const removePlayer = (id: string, avatar?: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPlayers = () => setPlayers([]);

  return { players, addPlayer, removePlayer, clearPlayers };
}
