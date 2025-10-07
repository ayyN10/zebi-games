import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Zebi Games
            </h1>
          </header>

          <div className="flex flex-col justify-center gap-4">
            <Button href="/players" variant="primary">
              Gestion des Joueurs
            </Button>
            <Button href="/game-modes" variant="secondary">
              Modes de Jeu
            </Button>
            <Button href="/redirect" variant="neutral">
              Redirection
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
