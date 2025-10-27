"use client";

import { useEffect, useState } from "react";

export type Player = { 
  id: string; 
  name: string; 
  avatar?: string;
  sips: number;
};

const STORAGE_KEY = "zebi-games:players";

export default function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migration: ajouter sips: 0 aux joueurs existants qui n'en ont pas
        const migrated = parsed.map((p: any) => ({
          ...p,
          sips: p.sips ?? 0,
        }));
        setPlayers(migrated);
      }
    } catch (error) {
      console.error("Failed to load players:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persister à chaque changement (seulement après l'initialisation)
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    } catch (error) {
      console.error("Failed to save players:", error);
    }
  }, [players, isInitialized]);

  const addPlayer = (name: string, avatar?: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setPlayers((prev) => [...prev, { id, name: name.trim(), avatar, sips: 0 }]);
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPlayers = () => setPlayers([]);

  const addSips = (id: string, amount: number) => {
    setPlayers((prev) => 
      prev.map((p) => p.id === id ? { ...p, sips: p.sips + amount } : p)
    );
  };

  const removeSips = (id: string, amount: number) => {
    setPlayers((prev) => 
      prev.map((p) => p.id === id ? { ...p, sips: Math.max(0, p.sips - amount) } : p)
    );
  };

  const resetSips = (id: string) => {
    setPlayers((prev) => 
      prev.map((p) => p.id === id ? { ...p, sips: 0 } : p)
    );
  };

  const resetAllSips = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, sips: 0 })));
  };

  return { 
    players, 
    addPlayer, 
    removePlayer, 
    clearPlayers,
    addSips,
    removeSips,
    resetSips,
    resetAllSips,
  };
}
