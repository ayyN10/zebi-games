# Architecture des Mini-Jeux - Betrayed Game

## 📁 Structure

```
src/app/betrayed-game/
├── _lib/
│   ├── minigames/
│   │   ├── types.ts           # Types et interfaces
│   │   ├── registry.ts        # Registre centralisé des mini-jeux
│   │   └── games/
│   │       ├── index.ts       # Point d'entrée des mini-jeux
│   │       ├── UniqueTraitorGame.tsx
│   │       ├── AnnounceGame.tsx
│   │       └── ImpostorGame.tsx
│   └── useGameManager.ts
├── _components/
│   ├── MiniGameOrchestrator.tsx  # Orchestrateur de mini-jeux
│   └── ...
└── page.tsx
```

## 🎯 Concepts Clés

### 1. **Système de Types (`types.ts`)**

Le système utilise des types TypeScript stricts pour garantir la cohérence :

```typescript
// Type de mini-jeu
type MiniGameType =
  | "unique-traitor"
  | "announce"
  | "impostor"
  | "vote"
  | "none";

// Configuration d'un mini-jeu
interface MiniGameConfig {
  id: MiniGameType;
  name: string;
  description: string;
  minPlayers: number;
  icon: string;
  probability: number; // Probabilité d'apparition (0-1)
}

// Résultat d'un mini-jeu
interface MiniGameResult {
  playerId: string;
  sipsToAdd: number;
  reason: string;
  type: "penalty" | "reward" | "neutral";
}

// Props communes à tous les mini-jeux
interface BaseMiniGameProps {
  players: Player[];
  currentRound: number;
  onComplete: (results: MiniGameResult[]) => void;
  onSkip: () => void;
}
```

### 2. **Registre des Mini-Jeux (`registry.ts`)**

Le registre centralise tous les mini-jeux disponibles avec un pattern **Registry**.

**Avantages :**

- ✅ Point unique pour gérer tous les mini-jeux
- ✅ Sélection aléatoire pondérée par probabilité
- ✅ Filtrage automatique selon le nombre de joueurs
- ✅ Facilite l'ajout de nouveaux mini-jeux

**Fonctions principales :**

```typescript
miniGameRegistry.register(definition); // Enregistrer un mini-jeu
miniGameRegistry.get(type); // Récupérer un mini-jeu
miniGameRegistry.getAll(); // Tous les mini-jeux
miniGameRegistry.getAvailableGames(count); // Mini-jeux compatibles
miniGameRegistry.selectRandomGame(count); // Sélection aléatoire
```

### 3. **Orchestrateur (`MiniGameOrchestrator.tsx`)**

Composant qui charge dynamiquement le bon mini-jeu selon le type :

```typescript
<MiniGameOrchestrator
  miniGameType={gameManager.miniGameType}
  players={players}
  currentRound={gameManager.currentRound}
  onComplete={gameManager.handleMinigameComplete}
  onSkip={gameManager.handleSkipMinigame}
/>
```

**Responsabilités :**

- Récupère le composant depuis le registre
- Gère les cas d'erreur (mini-jeu introuvable)
- Gère le cas spécial "none" (pas de mini-jeu)

### 4. **Composants de Mini-Jeux**

Chaque mini-jeu est un composant React autonome qui respecte l'interface `BaseMiniGameProps`.

#### Exemple : Le Traître Unique

```tsx
function UniqueTraitorGame({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  // Logique du jeu...

  // À la fin, retourner les résultats
  onComplete([
    { playerId: "123", sipsToAdd: 5, reason: "Démasqué !", type: "penalty" },
  ]);
}
```

## 🎮 Mini-Jeux Disponibles

### 1. **Le Traître Unique** 🎭

- **Min joueurs :** 3
- **Probabilité :** 30%
- **Concept :** Un joueur distribue secrètement des gorgées. Les autres votent pour le démasquer.

### 2. **J'annonce** 📢

- **Min joueurs :** 2
- **Probabilité :** 25%
- **Concept :** Chaque joueur fait une annonce. Les autres boivent si ça les concerne.

### 3. **L'Imposteur** 🕵️

- **Min joueurs :** 4
- **Probabilité :** 35%
- **Concept :** Style Among Us - Un imposteur se cache. Discussions et votes pour l'éliminer.

### 4. **Aucun** ⏭️

- **Min joueurs :** 0
- **Probabilité :** 10%
- **Concept :** Passer directement au tour suivant.

## 🔧 Ajouter un Nouveau Mini-Jeu

### Étape 1 : Créer le composant

Créez un nouveau fichier dans `_lib/minigames/games/` :

```tsx
// MonNouveauJeu.tsx
"use client";

import type { BaseMiniGameProps, MiniGameResult } from "../types";

function MonNouveauJeu({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  const handleFinish = () => {
    const results: MiniGameResult[] = [
      {
        playerId: players[0].id,
        sipsToAdd: 3,
        reason: "A perdu le défi",
        type: "penalty",
      },
    ];
    onComplete(results);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      {/* UI du mini-jeu */}
    </main>
  );
}

export default MonNouveauJeu;
```

### Étape 2 : Ajouter le type

Dans `types.ts`, ajouter le nouveau type :

```typescript
export type MiniGameType =
  | "unique-traitor"
  | "announce"
  | "impostor"
  | "vote"
  | "mon-nouveau-jeu" // ← Nouveau
  | "none";
```

### Étape 3 : Exporter le composant

Dans `games/index.ts` :

```typescript
export { default as MonNouveauJeu } from "./MonNouveauJeu";
```

### Étape 4 : Enregistrer dans le registre

Dans `registry.ts` :

```typescript
import { MonNouveauJeu } from "./games";

miniGameRegistry.register({
  config: {
    id: "mon-nouveau-jeu",
    name: "Mon Nouveau Jeu",
    description: "Description du jeu...",
    minPlayers: 3,
    icon: "🎲",
    probability: 0.2, // 20% de chance
  },
  component: MonNouveauJeu,
});
```

**C'est tout !** Le nouveau mini-jeu sera automatiquement intégré au système.

## 🎲 Sélection Aléatoire

La sélection est pondérée par les probabilités :

```typescript
// Exemple avec 5 joueurs
miniGameRegistry.selectRandomGame(5);

// Chances approximatives :
// - L'Imposteur: 35% (si ≥4 joueurs)
// - Le Traître Unique: 30% (si ≥3 joueurs)
// - J'annonce: 25%
// - Aucun: 10%
```

## 🔄 Flux de Données

```
Page (page.tsx)
    ↓
useGameManager
    ↓ (sélection aléatoire)
MiniGameOrchestrator
    ↓ (charge le composant)
UniqueTraitorGame / AnnounceGame / ImpostorGame
    ↓ (retourne résultats)
useGameManager.handleMinigameComplete(results)
    ↓ (applique les gorgées)
Tour suivant
```

## 🏗️ Bonnes Pratiques

### ✅ À FAIRE

- Toujours retourner un tableau de `MiniGameResult[]` via `onComplete()`
- Gérer le cas où le joueur veut passer (`onSkip`)
- Utiliser l'état local pour la logique du mini-jeu
- Ajouter des animations pour une meilleure UX
- Respecter l'interface `BaseMiniGameProps`

### ❌ À ÉVITER

- Ne pas modifier directement les gorgées des joueurs (passer par `results`)
- Ne pas bloquer l'UI sans moyen de sortir
- Ne pas oublier le bouton "Passer"
- Ne pas hardcoder les valeurs (utiliser les `props`)

## 🧪 Tests

Pour tester un mini-jeu :

1. Ajoutez-le au registre avec `probability: 1.0` (100%)
2. Lancez une partie
3. Testez tous les scénarios (victoire, défaite, égalité)
4. Vérifiez que les résultats sont correctement appliqués

## 📝 Notes Techniques

### Performance

- Les composants sont chargés à la demande (lazy loading possible)
- Le registre est un singleton (une seule instance)
- Pas de re-render inutile grâce à la séparation des composants

### Extensibilité

- Facile d'ajouter de nouveaux mini-jeux
- Système de probabilités flexible
- Support de meta-données personnalisées (via `data` dans `MiniGameState`)

### Maintenance

- Code modulaire et découplé
- Types stricts TypeScript
- Documentation inline
- Architecture claire et prévisible
