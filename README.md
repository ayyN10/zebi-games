# 🎮 Zebi Games

Application de jeux sociaux développée avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 🎯 Jeux Disponibles

### 1. 🎭 Betrayed Game - "Qui veut te trahir ?"

Jeu de traîtrise et de déduction avec mini-jeux intégrés entre chaque tour.

**Mini-jeux inclus:**

- 🎭 Le Traître Unique
- 📢 J'annonce
- 🕵️ L'Imposteur
- 🗳️ Vote Collectif

### 2. 🎮 Find Game

Devinez le jeu vidéo à partir d'indices.

### 3. 👥 Players Management

Gestion des joueurs pour tous les jeux.

## 📚 Documentation

### 📖 Documentation Principale

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture complète du projet
- **[SUMMARY.md](./SUMMARY.md)** - Résumé visuel du système
- **[CHANGELOG.md](./CHANGELOG.md)** - Liste des changements

### 🚀 Guides Rapides

- **[QUICK_START.md](./QUICK_START.md)** - Guide pour ajouter un mini-jeu en 4 étapes

### 🎮 Documentation Spécifique

- **[Mini-Games README](./src/app/betrayed-game/_lib/minigames/README.md)** - Documentation technique des mini-jeux

## 🏗️ Architecture

Le projet utilise une architecture modulaire avec des patterns de design professionnels:

```
src/
├── app/
│   ├── betrayed-game/          # Jeu principal avec mini-jeux
│   │   ├── _lib/
│   │   │   ├── minigames/      # Système extensible de mini-jeux
│   │   │   │   ├── types.ts
│   │   │   │   ├── registry.ts
│   │   │   │   └── games/
│   │   │   └── useGameManager.ts
│   │   └── _components/
│   ├── find-game/              # Jeu de devinettes
│   ├── players/                # Gestion des joueurs
│   └── game-modes/             # Sélection des modes
└── components/
    └── ui/                     # Composants réutilisables
```

## 🎨 Technologies

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Patterns:** Registry, Strategy, Factory, Observer

## 🔧 Fonctionnalités Clés

### ✨ Système de Mini-Jeux Extensible

- Architecture modulaire et type-safe
- Ajout de nouveaux jeux en 4 étapes simples
- Sélection aléatoire pondérée
- Filtrage automatique selon le nombre de joueurs

### 🎯 Gestion des Joueurs

- Ajout/suppression dynamique
- Compteur de gorgées
- Persistance locale

### 🎮 Modes de Jeu

- Multiple game modes disponibles
- Navigation intuitive
- UI/UX cohérente

## 📦 Structure du Projet

```
zebi-games/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   └── components/             # Composants réutilisables
├── public/                     # Assets statiques
├── ARCHITECTURE.md             # Documentation architecture
├── QUICK_START.md             # Guide rapide
├── SUMMARY.md                 # Résumé visuel
└── CHANGELOG.md               # Changements
```

## 🚀 Ajouter un Mini-Jeu

Consultez [QUICK_START.md](./QUICK_START.md) pour un guide détaillé en 4 étapes.

**Résumé rapide:**

1. Créer le composant dans `games/`
2. Ajouter le type dans `types.ts`
3. Exporter dans `games/index.ts`
4. Enregistrer dans `registry.ts`

## 🧪 Scripts Disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour production
npm run start        # Démarrer en production
npm run lint         # Linter le code
```

## 📝 Bonnes Pratiques

- ✅ Types TypeScript stricts
- ✅ Composants réutilisables
- ✅ Code modulaire et découplé
- ✅ Documentation inline
- ✅ Patterns de design professionnels

## 🐛 Dépannage

### Le projet ne démarre pas

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreurs TypeScript

```bash
# Supprimer le cache Next.js
rm -rf .next
npm run dev
```

## 📈 Statistiques du Projet

- **Lignes de code:** ~2500+
- **Composants:** 20+
- **Mini-jeux:** 4
- **Pages de documentation:** 4
- **Types TypeScript:** 15+

## 🤝 Contribution

Pour contribuer:

1. Consultez [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Suivez les patterns existants
3. Documentez vos changements
4. Testez votre code

## 📄 License

Ce projet est sous licence MIT.

## 🎉 Crédits

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Architecture:** Design patterns professionnels

---

**Made with ❤️ by the Zebi Games Team**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
