import { fetchRandomGame } from "./_lib/rawg";
import GuessGame from "./_components/GuessGame";

export default async function FindGamePage() {
  const game = await fetchRandomGame();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Trouve le jeux
            </h1>
          </header>

          {game ? (
            <GuessGame game={game} />
          ) : (
            <p className="text-center text-slate-600">
              Impossible de charger un jeu. Vérifie ta clé API RAWG.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
