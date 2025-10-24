"use client";

import { useState } from "react";

export default function UpdateGamesPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0, games: 0 });

  const handleUpdate = async () => {
    setLoading(true);
    setStatus("Démarrage de la mise à jour...");
    setProgress({ current: 0, total: 0, games: 0 });

    try {
      const response = await fetch("/api/update-games", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));

              if (data.status) {
                setStatus(data.status);
              }
              if (data.progress) {
                setProgress(data.progress);
              }
              if (data.complete) {
                setStatus(`✅ Terminé ! ${data.total} jeux enregistrés.`);
              }
            }
          }
        }
      }
    } catch (error) {
      setStatus(`❌ Erreur : ${error instanceof Error ? error.message : "Inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-10 shadow-lg">
          <header className="text-center space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Mise à jour des jeux
            </h1>
            <p className="text-slate-600">
              Récupère tous les jeux depuis RAWG et les enregistre localement
            </p>
          </header>

          <div className="space-y-6">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 text-white px-6 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mise à jour en cours..." : "Mettre à jour la base de jeux"}
            </button>

            {status && (
              <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-800 font-medium">{status}</p>
              </div>
            )}

            {loading && progress.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Page {progress.current} / {progress.total}</span>
                  <span>{progress.games} jeux récupérés</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
