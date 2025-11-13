import type { Player } from '../../../players/_lib/usePlayers';

/**
 * Types de mini-jeux disponibles
 */
export type MiniGameType =
  | 'unique-traitor'    // Le traître unique
  | 'announce'          // J'annonce
  | 'impostor'          // L'imposteur
  | 'vote'              // Vote collectif
  | 'none';             // Pas de mini-jeu

/**
 * Configuration d'un mini-jeu
 */
export interface MiniGameConfig {
  id: MiniGameType;
  name: string;
  description: string;
  minPlayers: number;
  icon: string;
  probability: number; // Probabilité d'apparition (0-1)
}

/**
 * État d'un mini-jeu en cours
 */
export interface MiniGameState {
  type: MiniGameType;
  currentStep: number;
  maxSteps: number;
  data: Record<string, any>; // Données spécifiques au mini-jeu
}

/**
 * Résultat d'un mini-jeu
 */
export interface MiniGameResult {
  playerId: string;
  sipsToAdd: number;
  reason: string;
  type: 'penalty' | 'reward' | 'neutral';
}

/**
 * Props communes à tous les composants de mini-jeux
 */
export interface BaseMiniGameProps {
  players: Player[];
  currentRound: number;
  onComplete: (results: MiniGameResult[]) => void;
  onSkip: () => void;
}

/**
 * Interface pour définir un mini-jeu
 */
export interface MiniGameDefinition {
  config: MiniGameConfig;
  component: React.ComponentType<BaseMiniGameProps>;
}
