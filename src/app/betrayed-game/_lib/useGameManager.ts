import { useState, useCallback } from 'react';
import type { Player } from '../../players/_lib/usePlayers';
import { miniGameRegistry } from './minigames/registry';
import type { MiniGameType, MiniGameResult } from './minigames/types';

export type GamePhase = 'distribution' | 'accusation' | 'results' | 'minigame' | 'ended';

export type { MiniGameType };

interface Distribution {
  from: string; // ID du joueur qui donne
  to: string;   // ID du joueur qui reçoit
  amount: number;
}

interface AccusationResult {
  playerId: string;
  sipsToAdd: number;
  reason: string;
}

interface GameState {
  currentRound: number;
  currentPlayerIndex: number;
  currentPhase: GamePhase;
  sipsDistributed: number;
  miniGameType: MiniGameType;
  isGameEnded: boolean;
  distributions: Distribution[]; // Historique des distributions du tour
  accusationIndex: number; // Index du joueur qui doit accuser
  accusationResults: AccusationResult[];
}

interface UseGameManagerProps {
  maxRounds: number;
  sipsPerRound: number;
  players: Player[];
  onAddSips: (id: string, amount: number) => void;
}

export function useGameManager({
  maxRounds,
  sipsPerRound,
  players,
  onAddSips,
}: UseGameManagerProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    currentPlayerIndex: 0,
    currentPhase: 'distribution',
    sipsDistributed: 0,
    miniGameType: 'none',
    isGameEnded: false,
    distributions: [],
    accusationIndex: 0,
    accusationResults: [],
  });

  // Obtenir les joueurs qui ont reçu des gorgées
  const getPlayersWithSips = useCallback(() => {
    const playersMap = new Map<string, { player: Player; receivedSips: number }>();

    gameState.distributions.forEach(dist => {
      const existing = playersMap.get(dist.to);
      if (existing) {
        existing.receivedSips += dist.amount;
      } else {
        const player = players.find(p => p.id === dist.to);
        if (player) {
          playersMap.set(dist.to, { player, receivedSips: dist.amount });
        }
      }
    });

    return Array.from(playersMap.values()).map(({ player, receivedSips }) => ({
      ...player,
      receivedSips,
    }));
  }, [gameState.distributions, players]);

  // Distribuer une gorgée
  const handleDistributeSip = useCallback((targetId: string) => {
    const currentPlayerId = players[gameState.currentPlayerIndex].id;

    setGameState(prev => {
      // Enregistrer la distribution de TOUTES les gorgées du tour
      const newDistribution: Distribution = {
        from: currentPlayerId,
        to: targetId,
        amount: sipsPerRound, // Distribuer toutes les gorgées d'un coup
      };

      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % players.length;

      // Si on revient au premier joueur, fin du tour -> phase d'accusation
      if (nextPlayerIndex === 0) {
        return {
          ...prev,
          currentPhase: 'accusation',
          sipsDistributed: 0,
          distributions: [...prev.distributions, newDistribution],
          accusationIndex: 0,
        };
      }

      // Sinon, joueur suivant
      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        sipsDistributed: 0,
        distributions: [...prev.distributions, newDistribution],
      };
    });
  }, [players, gameState.currentPlayerIndex, sipsPerRound]);

  // Gérer une accusation
  const handleAccusation = useCallback((accusedId: string | null) => {
    const accusingPlayer = getPlayersWithSips()[gameState.accusationIndex];

    if (!accusingPlayer) return;

    const actualTraitors = gameState.distributions
      .filter(d => d.to === accusingPlayer.id && d.from !== accusingPlayer.id)
      .map(d => d.from);

    let result: AccusationResult;

    if (accusedId === null) {
      result = {
        playerId: accusingPlayer.id,
        sipsToAdd: accusingPlayer.receivedSips || 0,
        reason: "A choisi de boire directement (sécurisé)",
      };
    } else if (actualTraitors.includes(accusedId)) {
      const sipsCount = gameState.distributions
        .filter(d => d.from === accusedId && d.to === accusingPlayer.id)
        .reduce((sum, d) => sum + d.amount, 0);
      const accusedPlayer = players.find(p => p.id === accusedId);
      result = {
        playerId: accusedId,
        sipsToAdd: sipsCount * 2,
        reason: `Attrapé en train de trahir ${accusingPlayer.name} ! (×2)`,
      };
    } else {
      const accusedPlayer = players.find(p => p.id === accusedId);
      result = {
        playerId: accusingPlayer.id,
        sipsToAdd: accusingPlayer.receivedSips * 2 || 0,
        reason: `S'est trompé en accusant ${accusedPlayer?.name} ! (×2)`,
      };
    }

    setGameState(prev => {
      const playersWithSips = getPlayersWithSips();
      const nextAccusationIndex = prev.accusationIndex + 1;
      const newResults = [...prev.accusationResults, result];

      // Si tous les joueurs qui ont reçu des gorgées ont accusé
      if (nextAccusationIndex >= playersWithSips.length) {
        return {
          ...prev,
          currentPhase: 'results',
          accusationIndex: 0,
          accusationResults: newResults,
        };
      }

      return {
        ...prev,
        accusationIndex: nextAccusationIndex,
        accusationResults: newResults,
      };
    });
  }, [gameState.distributions, gameState.accusationIndex, players, getPlayersWithSips]);

  // Passer des résultats au mini-jeu
  const handleResultsContinue = useCallback(() => {
    // Appliquer toutes les gorgées
    gameState.accusationResults.forEach(result => {
      onAddSips(result.playerId, result.sipsToAdd);
    });

    const miniGame = miniGameRegistry.selectRandomGame(players.length);
    setGameState(prev => ({
      ...prev,
      currentPhase: 'minigame',
      miniGameType: miniGame,
      accusationResults: [],
    }));
  }, [gameState.accusationResults, onAddSips, players.length]);

  // Obtenir les résultats formatés
  const getFormattedResults = useCallback(() => {
    const resultsMap = new Map<string, { totalSips: number; details: string[] }>();

    gameState.accusationResults.forEach(result => {
      const existing = resultsMap.get(result.playerId);
      if (existing) {
        existing.totalSips += result.sipsToAdd;
        existing.details.push(result.reason);
      } else {
        resultsMap.set(result.playerId, {
          totalSips: result.sipsToAdd,
          details: [result.reason],
        });
      }
    });

    return players.map(player => ({
      player,
      totalSips: resultsMap.get(player.id)?.totalSips || 0,
      details: resultsMap.get(player.id)?.details || [],
    }));
  }, [gameState.accusationResults, players]);

  // Terminer un mini-jeu et passer au tour suivant
  const handleMinigameComplete = useCallback((results: MiniGameResult[] = []) => {
    // Appliquer les résultats du mini-jeu
    results.forEach(result => {
      onAddSips(result.playerId, result.sipsToAdd);
    });

    setGameState(prev => {
      const nextRound = prev.currentRound + 1;

      if (nextRound > maxRounds) {
        return {
          ...prev,
          currentPhase: 'ended',
          isGameEnded: true,
        };
      }

      return {
        ...prev,
        currentRound: nextRound,
        currentPlayerIndex: 0,
        currentPhase: 'distribution',
        sipsDistributed: 0,
        miniGameType: 'none',
        distributions: [], // Réinitialiser uniquement les distributions du tour
        accusationIndex: 0,
        accusationResults: [], // Réinitialiser les résultats d'accusation
      };
    });
  }, [maxRounds, onAddSips]);

  // Passer le mini-jeu (optionnel)
  const handleSkipMinigame = useCallback(() => {
    handleMinigameComplete();
  }, [handleMinigameComplete]);

  const currentPlayer = players[gameState.currentPlayerIndex];
  const currentAccuser = getPlayersWithSips()[gameState.accusationIndex];

  return {
    ...gameState,
    currentPlayer,
    currentAccuser,
    playersWithSips: getPlayersWithSips(),
    formattedResults: getFormattedResults(),
    handleDistributeSip,
    handleAccusation,
    handleResultsContinue,
    handleMinigameComplete,
    handleSkipMinigame,
  };
}
