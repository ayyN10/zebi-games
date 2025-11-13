import type { MiniGameDefinition, MiniGameType, BaseMiniGameProps } from './types';
import { UniqueTraitorGame, AnnounceGame, ImpostorGame, VoteGame } from './games';

/**
 * Registre centralisé de tous les mini-jeux disponibles
 */
class MiniGameRegistry {
  private games: Map<MiniGameType, MiniGameDefinition> = new Map();

  /**
   * Enregistre un nouveau mini-jeu
   */
  register(definition: MiniGameDefinition): void {
    this.games.set(definition.config.id, definition);
  }

  /**
   * Récupère un mini-jeu par son type
   */
  get(type: MiniGameType): MiniGameDefinition | undefined {
    return this.games.get(type);
  }

  /**
   * Récupère tous les mini-jeux disponibles
   */
  getAll(): MiniGameDefinition[] {
    return Array.from(this.games.values());
  }

  /**
   * Récupère les mini-jeux compatibles avec le nombre de joueurs
   */
  getAvailableGames(playerCount: number): MiniGameDefinition[] {
    return this.getAll().filter(
      game => game.config.id !== 'none' && playerCount >= game.config.minPlayers
    );
  }

  /**
   * Sélectionne un mini-jeu aléatoire basé sur les probabilités
   */
  selectRandomGame(playerCount: number): MiniGameType {
    const availableGames = this.getAvailableGames(playerCount);

    if (availableGames.length === 0) {
      return 'none';
    }

    // Calculer le total des probabilités
    const totalProbability = availableGames.reduce(
      (sum, game) => sum + game.config.probability,
      0
    );

    // Générer un nombre aléatoire
    let random = Math.random() * totalProbability;

    // Sélectionner le jeu en fonction de la probabilité
    for (const game of availableGames) {
      random -= game.config.probability;
      if (random <= 0) {
        return game.config.id;
      }
    }

    // Fallback sur le premier jeu disponible
    return availableGames[0].config.id;
  }
}

// Instance singleton du registre
export const miniGameRegistry = new MiniGameRegistry();

// Enregistrement des mini-jeux
miniGameRegistry.register({
  config: {
    id: 'unique-traitor',
    name: 'Le Traître Unique',
    description: 'Un seul joueur distribue toutes les gorgées. Les autres doivent deviner qui c\'est !',
    minPlayers: 3,
    icon: '🎭',
    probability: 0.3,
  },
  component: UniqueTraitorGame,
});

miniGameRegistry.register({
  config: {
    id: 'announce',
    name: 'J\'annonce',
    description: 'Chaque joueur annonce quelque chose, et les autres boivent si ça les concerne !',
    minPlayers: 2,
    icon: '📢',
    probability: 0.25,
  },
  component: AnnounceGame,
});

miniGameRegistry.register({
  config: {
    id: 'impostor',
    name: 'L\'Imposteur',
    description: 'Un imposteur se cache parmi vous. Trouvez-le avant qu\'il ne vous élimine tous !',
    minPlayers: 4,
    icon: '🕵️',
    probability: 0.35,
  },
  component: ImpostorGame,
});

miniGameRegistry.register({
  config: {
    id: 'vote',
    name: 'Vote Collectif',
    description: 'Votez OUI ou NON sur une question. La minorité boit !',
    minPlayers: 3,
    icon: '🗳️',
    probability: 0.25,
  },
  component: VoteGame,
});

miniGameRegistry.register({
  config: {
    id: 'none',
    name: 'Pas de mini-jeu',
    description: 'Continuer directement au tour suivant',
    minPlayers: 0,
    icon: '⏭️',
    probability: 0.1,
  },
  component: () => null,
});
