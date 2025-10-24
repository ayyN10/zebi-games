const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  metacritic?: number | null;
}

export async function fetchRandomGame(): Promise<Game | null> {
  if (!RAWG_API_KEY) {
    console.error("RAWG_API_KEY not set");
    return null;
  }

  try {
    const randomPage = Math.floor(Math.random() * 50) + 1; // Réduit à 50 pages (jeux populaires)
    const res = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${randomPage}&page_size=20&dates=2000-01-01,2025-12-31&metacritic=80&ordering=-rating&exclude_additions=true`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      console.error("RAWG API error:", res.status);
      return null;
    }

    const data = await res.json();
    const games: Game[] = data.results || [];
    
    // Filtrer pour être sûr d'avoir un jeu avec metacritic >= 80
    const validGames = games.filter(g => g.metacritic && g.metacritic >= 80);
    
    if (validGames.length === 0) return null;

    const randomGame = validGames[Math.floor(Math.random() * validGames.length)];
    return randomGame;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return null;
  }
}
