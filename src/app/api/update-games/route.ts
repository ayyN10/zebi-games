import { promises as fs } from "node:fs";
import path from "node:path";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";
const CACHE_FILE = path.join(process.cwd(), "src", "app", "find-game", "_lib", "games-cache.json");

interface Game {
  id: number;
  name: string;
  background_image: string | null;
  metacritic: number | null;
}

export async function POST() {
  if (!RAWG_API_KEY) {
    return new Response(JSON.stringify({ error: "RAWG_API_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const allNames: string[] = [];
      let page = 1;
      let hasMore = true;
      const MAX_PAGES = 100; // Limite stricte : 100 appels API max
      const PAGE_SIZE = 40; // Max autorisé par RAWG

      try {
        while (hasMore && page <= MAX_PAGES) {
          const res = await fetch(
            `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}&page_size=${PAGE_SIZE}&dates=2000-01-01,2025-12-31&metacritic=80&ordering=-rating&exclude_additions=true`,
            { cache: "no-store" }
          );

          if (!res.ok) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ status: `Erreur API page ${page}` })}\n\n`)
            );
            break;
          }

          const data = await res.json();
          const games: Game[] = data.results || [];

          if (games.length === 0) {
            hasMore = false;
            break;
          }

          // Filtrer uniquement les jeux avec metacritic >= 80
          games.forEach((g) => {
            if (g.name && g.metacritic && g.metacritic >= 80 && !allNames.includes(g.name)) {
              allNames.push(g.name);
            }
          });

          // Envoi de la progression
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: `Récupération page ${page}/${MAX_PAGES}...`,
                progress: {
                  current: page,
                  total: MAX_PAGES,
                  games: allNames.length,
                },
              })}\n\n`
            )
          );

          page++;

          // Délai pour respecter rate limiting (50ms entre chaque requête)
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Sauvegarde dans le fichier JSON
        await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
        await fs.writeFile(CACHE_FILE, JSON.stringify(allNames, null, 2), "utf-8");

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              complete: true,
              total: allNames.length,
              status: `✅ Sauvegarde terminée : ${allNames.length} jeux (${page - 1} requêtes API)`,
            })}\n\n`
          )
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              status: `Erreur: ${error instanceof Error ? error.message : "Inconnue"}`,
            })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
