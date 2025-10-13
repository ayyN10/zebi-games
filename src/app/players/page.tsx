import PlayerManager from "./_components/PlayerManager";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Gestion des joueurs - Zebi Games",
  description: "Liste, ajout et suppression de joueurs",
};

export default function PlayersPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-8 shadow-lg flex flex-col gap-6 justify-center items-center">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestion des joueurs</h1>
            <p className="text-slate-600">Listez, ajoutez et supprimez des joueurs.</p>
          </header>
          <PlayerManager />
          <Button href="/game-modes" variant="secondary" className="w-fit">
                        Modes de Jeu
                      </Button>
        </div>
      </section>
    </main>
  );
}
