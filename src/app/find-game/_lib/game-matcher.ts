import gamesCache from "./games-cache.json";

// Normalise une chaîne pour la comparaison
function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Enlève la ponctuation
    .replace(/\s+/g, " "); // Normalise les espaces
}

// Vérifie si le guess correspond au nom du jeu
export function isCorrectGuess(guess: string, gameName: string): boolean {
  const normalizedGuess = normalize(guess);
  const normalizedGame = normalize(gameName);
  
  // Match exact
  if (normalizedGuess === normalizedGame) return true;
  
  // Match partiel (le guess contient le nom du jeu ou vice versa)
  if (normalizedGame.includes(normalizedGuess) || normalizedGuess.includes(normalizedGame)) {
    return true;
  }
  
  return false;
}

// Trouve les suggestions basées sur le guess
export function findSuggestions(guess: string, limit = 5): string[] {
  const normalized = normalize(guess);
  
  if (normalized.length < 2) return [];
  
  const matches = gamesCache.filter(name => 
    normalize(name).includes(normalized)
  );
  
  return matches.slice(0, limit);
}

// Vérifie si un jeu existe dans le cache
export function gameExists(gameName: string): boolean {
  const normalized = normalize(gameName);
  return gamesCache.some(name => normalize(name) === normalized);
}
