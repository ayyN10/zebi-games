const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface Game {
  id: number;
  name: string;
  background_image: string | null;
}

export async function fetchRandomGame(): Promise<Game | null> {
  if (!RAWG_API_KEY) {
    console.error("RAWG_API_KEY not set");
    return null;
  }

  try {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const res = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${randomPage}&page_size=20`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      console.error("RAWG API error:", res.status);
      return null;
    }

    const data = await res.json();
    const games: Game[] = data.results || [];
    
    if (games.length === 0) return null;

    const randomGame = games[Math.floor(Math.random() * games.length)];
    return randomGame;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return null;
  }
}
