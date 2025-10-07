"use client";

import { useState, useRef, useEffect } from "react";

export default function PlayerForm({ onAdd }: { onAdd: (name: string, avatar?: string) => void }) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    let avatarPath: string | undefined = undefined;
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      const res = await fetch("/api/images", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        avatarPath = data.path; // e.g. "/_images/uuid.jpg"
      }
    }

    onAdd(trimmed, avatarPath);
    setName("");
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const initial = (name.trim()[0]?.toUpperCase() ?? "?");

  return (
    <form onSubmit={submit} className="flex justify-center items-center flex-col gap-2 text-center">
      {/* Hidden file input (camera-friendly) */}
      <input
        id="player-avatar"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          if (!file) {
            setAvatarFile(null);
            setAvatarPreview("");
            return;
          }
          setAvatarFile(file);
          setAvatarPreview(URL.createObjectURL(file));
        }}
        className="sr-only"
      />

      {/* Clickable avatar circle with edit pictogram */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Changer l'avatar"
        title="Changer l'avatar"
        className="relative h-20 w-20 rounded-full overflow-hidden border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
            <span className="text-xl font-semibold">{initial}</span>
          </div>
        )}
        <span className="absolute bottom-1 right-1 inline-flex items-center justify-center rounded-full bg-white/90 p-1.5 shadow ring-1 ring-slate-200 text-slate-700 text-xs">
          ✎
        </span>
      </button>

      <input
        id="player-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du joueur"
        className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 text-white px-4 py-2.5 font-medium hover:bg-indigo-700 transition"
      >
        Ajouter
      </button>
    </form>
  );
}
