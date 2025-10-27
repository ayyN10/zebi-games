"use client";

import usePlayers from "../players/_lib/usePlayers";
import PlayerList from "./_components/PlayerList";

export default function BetrayedGamePage() {
  const { players } = usePlayers();
  
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Qui veut te trahir ?
            </h1>
            <p className="text-lg text-slate-600">
              Un jeu de traîtrise et de déduction
            </p>
          </header>

          <div className="space-y-6 text-slate-700">


            <PlayerList players={players} />
            {/* Règles principales */}
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                📜 Règles du jeu
              </h2>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="leading-relaxed">
                  <strong>À chaque tour</strong>, vous pouvez choisir de donner une gorgée à un autre joueur ou de boire vous-même, <strong>sans que personne ne sache</strong> qui a trahi.
                </li>
                <li className="leading-relaxed">
                  Les joueurs qui ont reçu une gorgée doivent <strong>deviner qui les a trahis</strong>.
                </li>
                <li className="leading-relaxed">
                  <strong>Si ils trouvent le traître :</strong> Le traître boit une gorgée supplémentaire pour chaque gorgée distribuée.
                </li>
                <li className="leading-relaxed">
                  <strong>Si ils se trompent :</strong> C'est eux qui boivent.
                </li>
                <li className="leading-relaxed">
                  <strong>Option sécurisée :</strong> Un joueur peut choisir de ne désigner personne et boire ses gorgées directement (pas de risque).
                </li>
              </ol>
            </div>

            {/* Mini-jeux */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                🎲 Mini-jeux
              </h2>
              <p className="leading-relaxed mb-3">
                Entre chaque tour, des mini-jeux peuvent pimenter la partie :
              </p>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li className="leading-relaxed">
                  <strong>Le traître unique :</strong> Un seul joueur distribue toutes les gorgées, les autres doivent le démasquer.
                </li>
                <li className="leading-relaxed">
                  <strong>J'annonce</strong> et bien d'autres surprises...
                </li>
                <li className="leading-relaxed text-slate-600">
                  On ne va pas tout spoiler, ce serait moins drôle ! 😉
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
