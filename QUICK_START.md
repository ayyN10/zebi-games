# 🚀 Guide Rapide - Ajouter un Mini-Jeu

## En 4 étapes simples !

### 1️⃣ Créer le fichier du mini-jeu

Créez `src/app/betrayed-game/_lib/minigames/games/MonJeu.tsx` :

```tsx
"use client";

import { useState } from "react";
import type { BaseMiniGameProps, MiniGameResult } from "../types";

function MonJeu({
  players,
  currentRound,
  onComplete,
  onSkip,
}: BaseMiniGameProps) {
  const [step, setStep] = useState<"intro" | "playing" | "result">("intro");

  const handleFinish = () => {
    // Créer les résultats
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

  if (step === "intro") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              🎮 Mon Nouveau Jeu
            </h1>
            <p className="text-center text-lg text-slate-700 mb-6">
              Description du jeu...
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep("playing")}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
              >
                Commencer
              </button>
              <button
                onClick={onSkip}
                className="bg-slate-400 text-white px-6 py-3 rounded-lg hover:bg-slate-500"
              >
                Passer
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === "playing") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <section className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">En cours...</h2>

            {/* Votre logique de jeu ici */}

            <button
              onClick={handleFinish}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium w-full"
            >
              Terminer
            </button>
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default MonJeu;
```

### 2️⃣ Ajouter le type

Dans `src/app/betrayed-game/_lib/minigames/types.ts`, ajoutez votre type :

```typescript
export type MiniGameType =
  | "unique-traitor"
  | "announce"
  | "impostor"
  | "vote"
  | "mon-jeu" // ← Nouveau !
  | "none";
```

### 3️⃣ Exporter le composant

Dans `src/app/betrayed-game/_lib/minigames/games/index.ts` :

```typescript
export { default as UniqueTraitorGame } from "./UniqueTraitorGame";
export { default as AnnounceGame } from "./AnnounceGame";
export { default as ImpostorGame } from "./ImpostorGame";
export { default as VoteGame } from "./VoteGame";
export { default as MonJeu } from "./MonJeu"; // ← Nouveau !
```

### 4️⃣ Enregistrer dans le registre

Dans `src/app/betrayed-game/_lib/minigames/registry.ts` :

```typescript
import {
  UniqueTraitorGame,
  AnnounceGame,
  ImpostorGame,
  VoteGame,
  MonJeu,
} from "./games";

// ... autres enregistrements ...

miniGameRegistry.register({
  config: {
    id: "mon-jeu",
    name: "Mon Nouveau Jeu",
    description: "Description courte du jeu",
    minPlayers: 3, // Minimum de joueurs requis
    icon: "🎮", // Icône emoji
    probability: 0.2, // 20% de chance d'apparition
  },
  component: MonJeu,
});
```

---

## ✅ C'est tout !

Votre mini-jeu est maintenant intégré au système et apparaîtra automatiquement pendant les parties !

## 🎯 Tips

### Gestion des résultats

```typescript
const results: MiniGameResult[] = [
  {
    playerId: "player-id",
    sipsToAdd: 3, // Nombre de gorgées à ajouter
    reason: "A perdu le jeu", // Raison affichée
    type: "penalty", // 'penalty' | 'reward' | 'neutral'
  },
];
```

### Probabilités

- `0.1` = 10% de chance
- `0.5` = 50% de chance
- `1.0` = 100% de chance

### Étapes recommandées

1. **intro** - Présentation des règles
2. **playing** - Jeu en cours
3. **result** - Affichage des résultats (optionnel)

### Classes CSS utiles

```tsx
// Bouton principal
className = "bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700";

// Bouton secondaire
className = "bg-slate-400 text-white px-6 py-3 rounded-lg hover:bg-slate-500";

// Conteneur principal
className =
  "rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg";

// Encadré informatif
className = "bg-blue-50 rounded-lg p-4 border border-blue-200";
```

## 📖 Ressources

- [Documentation complète](./src/app/betrayed-game/_lib/minigames/README.md)
- [Architecture détaillée](./ARCHITECTURE.md)
- [Exemples de mini-jeux](./src/app/betrayed-game/_lib/minigames/games/)

## 🐛 Dépannage

### Le jeu n'apparaît pas ?

1. Vérifiez que le type est bien ajouté dans `types.ts`
2. Vérifiez l'export dans `games/index.ts`
3. Vérifiez l'enregistrement dans `registry.ts`
4. Assurez-vous d'avoir assez de joueurs (`minPlayers`)

### Erreur TypeScript ?

```bash
# Redémarrer le serveur de développement
npm run dev
```

### Le composant ne charge pas ?

Vérifiez que vous avez bien :

- Exporté avec `export default`
- Importé dans `games/index.ts`
- Enregistré dans le registre

---

**Besoin d'aide ?** Consultez les autres mini-jeux comme exemples ! 🚀
