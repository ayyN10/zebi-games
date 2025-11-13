# 🎮 Zebi Games - Architecture Complète

## 📊 Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BETRAYED GAME                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │         page.tsx (Main UI)              │
        │  - Gère les phases du jeu               │
        │  - Orchestre les composants             │
        └────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │               │
         ▼              ▼               ▼
    ┌────────┐   ┌──────────┐   ┌──────────┐
    │Settings│   │ Players  │   │Accusation│
    │  Game  │   │   List   │   │  Phase   │
    └────────┘   └──────────┘   └──────────┘

         ┌──────────────────────────────┐
         │     useGameManager Hook      │
         │  - Gestion de l'état global  │
         │  - Logique métier            │
         │  - Sélection des mini-jeux   │
         └──────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │  MiniGameOrchestrator.tsx    │
         │  - Charge dynamiquement      │
         │  - Gère les erreurs          │
         └──────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │     MiniGame Registry        │
         │  - Registre centralisé       │
         │  - Sélection aléatoire       │
         │  - Filtrage par joueurs      │
         └──────────────────────────────┘
                        │
         ┌──────────────┼───────────────┐
         │              │                │
         ▼              ▼                ▼
    ┌─────────┐   ┌─────────┐   ┌──────────┐
    │ Traître │   │Imposteur│   │   Vote   │
    │  Unique │   │  Game   │   │  Collectif│
    └─────────┘   └─────────┘   └──────────┘
         │              │                │
         └──────────────┼────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │ MiniGameResult[] │
              │  - playerId      │
              │  - sipsToAdd     │
              │  - reason        │
              └──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │ Apply to Players │
              └──────────────────┘
```

## 🗂️ Structure des Fichiers

```
src/app/betrayed-game/
│
├── page.tsx                          # 🎯 Point d'entrée principal
│   └── Gère les phases: distribution, accusation, mini-jeux, résultats
│
├── _lib/
│   ├── useGameManager.ts             # 🧠 Hook de gestion d'état
│   │   ├── handleDistributeSip()
│   │   ├── handleAccusation()
│   │   ├── handleMinigameComplete()
│   │   └── handleResultsContinue()
│   │
│   └── minigames/                    # 🎲 Système de mini-jeux
│       ├── types.ts                  # 📝 Types TypeScript
│       │   ├── MiniGameType
│       │   ├── MiniGameConfig
│       │   ├── MiniGameResult
│       │   └── BaseMiniGameProps
│       │
│       ├── registry.ts               # 📚 Registre centralisé
│       │   ├── MiniGameRegistry
│       │   ├── register()
│       │   ├── get()
│       │   ├── getAvailableGames()
│       │   └── selectRandomGame()
│       │
│       ├── games/                    # 🎮 Composants des mini-jeux
│       │   ├── index.ts
│       │   ├── UniqueTraitorGame.tsx # 🎭
│       │   ├── AnnounceGame.tsx      # 📢
│       │   ├── ImpostorGame.tsx      # 🕵️
│       │   └── VoteGame.tsx          # 🗳️
│       │
│       └── README.md                 # 📖 Documentation détaillée
│
└── _components/
    ├── MiniGameOrchestrator.tsx      # 🎬 Orchestrateur
    ├── PlayerList.tsx
    ├── DistrubitionSip.tsx
    ├── AccusationPhase.tsx
    ├── ResultOfDistrubition.tsx
    └── SettingGame.tsx
```

## 🔄 Flux de Données Détaillé

### 1️⃣ Phase de Distribution

```
Player distribue gorgées
        ↓
handleDistributeSip(targetId)
        ↓
Distribution enregistrée dans gameState
        ↓
Joueur suivant ou Phase d'accusation
```

### 2️⃣ Phase d'Accusation

```
Joueur ayant reçu des gorgées
        ↓
handleAccusation(accusedId)
        ↓
Vérification du traître
        ↓
AccusationResult créé
        ↓
Tous ont accusé → Phase Résultats
```

### 3️⃣ Phase Résultats

```
Affichage des résultats
        ↓
handleResultsContinue()
        ↓
Application des gorgées
        ↓
Sélection mini-jeu (via Registry)
        ↓
Phase Mini-jeu
```

### 4️⃣ Phase Mini-jeu

```
MiniGameOrchestrator charge le composant
        ↓
Joueurs jouent au mini-jeu
        ↓
onComplete(results: MiniGameResult[])
        ↓
handleMinigameComplete(results)
        ↓
Application des résultats
        ↓
Tour suivant ou Fin de partie
```

## 🎲 Mini-Jeux Implémentés

### 1. Le Traître Unique 🎭

**Fichier:** `UniqueTraitorGame.tsx`

- **Concept:** Un joueur distribue secrètement toutes les gorgées
- **Étapes:** Intro → Sélection traître → Vote → Révélation
- **Pénalités:**
  - Traître démasqué: sips × 2
  - Traître non trouvé: tous les autres boivent

### 2. J'annonce 📢

**Fichier:** `AnnounceGame.tsx`

- **Concept:** Chaque joueur fait une annonce
- **Étapes:** Intro → Annonce par joueur
- **Pénalités:** Basées sur qui est concerné

### 3. L'Imposteur 🕵️

**Fichier:** `ImpostorGame.tsx`

- **Concept:** Style Among Us - trouver l'imposteur
- **Étapes:** Révélation rôles → Discussion → Vote → Résultat
- **Pénalités:**
  - Imposteur gagne: innocents boivent 3
  - Imposteur perdu: boit 5
  - Éliminés par erreur: 2

### 4. Vote Collectif 🗳️

**Fichier:** `VoteGame.tsx`

- **Concept:** Question OUI/NON, minorité boit
- **Étapes:** Question → Vote → Révélation
- **Pénalités:**
  - Minorité: 3 gorgées
  - Égalité: tous boivent 2

## 🎯 Pattern Architecture

### Design Patterns Utilisés

#### 1. **Registry Pattern**

```typescript
// Centralise tous les mini-jeux
miniGameRegistry.register(definition);
```

✅ Facilite l'ajout de nouveaux jeux
✅ Point unique de vérité

#### 2. **Strategy Pattern**

```typescript
// Chaque mini-jeu implémente BaseMiniGameProps
interface BaseMiniGameProps {
  onComplete: (results: MiniGameResult[]) => void;
}
```

✅ Interchangeabilité des mini-jeux
✅ Interface commune

#### 3. **Observer Pattern**

```typescript
// useGameManager observe et réagit aux changements
handleMinigameComplete(results) {
  results.forEach(result => onAddSips(...));
}
```

✅ Séparation des responsabilités
✅ Réactivité

#### 4. **Factory Pattern**

```typescript
// MiniGameOrchestrator crée dynamiquement
const gameDefinition = miniGameRegistry.get(type);
return <MiniGameComponent {...props} />;
```

✅ Création dynamique
✅ Pas de couplage fort

## 🔧 Points d'Extension

### Ajouter un mini-jeu

**1. Créer le composant**

```tsx
// games/MonJeu.tsx
function MonJeu({ players, onComplete }: BaseMiniGameProps) {
  // Logique...
  return <div>UI</div>;
}
```

**2. Ajouter le type**

```typescript
// types.ts
export type MiniGameType = ... | 'mon-jeu';
```

**3. Exporter**

```typescript
// games/index.ts
export { default as MonJeu } from "./MonJeu";
```

**4. Enregistrer**

```typescript
// registry.ts
miniGameRegistry.register({
  config: { id: 'mon-jeu', ... },
  component: MonJeu,
});
```

### Personnaliser les probabilités

```typescript
// registry.ts
miniGameRegistry.register({
  config: {
    probability: 0.5, // 50% de chance
  },
});
```

### Filtrer par nombre de joueurs

```typescript
// Automatique via minPlayers
config: {
  minPlayers: 4, // Nécessite au moins 4 joueurs
}
```

## 📈 Bonnes Pratiques

### ✅ DO

- Utiliser TypeScript strict
- Respecter `BaseMiniGameProps`
- Retourner des `MiniGameResult[]`
- Ajouter des animations
- Tester tous les scénarios

### ❌ DON'T

- Ne pas modifier directement les states parents
- Ne pas bloquer l'UI
- Ne pas hardcoder les valeurs
- Ne pas oublier le bouton Skip

## 🧪 Tests Recommandés

### Tests Unitaires

- [ ] Chaque fonction de `useGameManager`
- [ ] Logique du registre
- [ ] Sélection aléatoire pondérée

### Tests d'Intégration

- [ ] Flux complet d'un tour
- [ ] Enchaînement distribution → accusation → mini-jeu
- [ ] Application correcte des gorgées

### Tests E2E

- [ ] Partie complète
- [ ] Tous les mini-jeux
- [ ] Cas limites (1 joueur, 10 joueurs, etc.)

## 📚 Ressources

- [Documentation des mini-jeux](./minigames/README.md)
- [Types TypeScript](./minigames/types.ts)
- [Registre](./minigames/registry.ts)

## 🎉 Conclusion

Architecture complète et extensible pour un système de mini-jeux modulaire !

**Avantages clés:**

- ✅ Facile d'ajouter de nouveaux jeux
- ✅ Code propre et maintenable
- ✅ Types stricts TypeScript
- ✅ Séparation des responsabilités
- ✅ Testable et scalable
