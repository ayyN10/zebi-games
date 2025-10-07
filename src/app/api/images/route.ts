import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

const IMAGES_DIR = path.join(process.cwd(), "public", "_images");
const PUBLIC_PREFIX = "/_images/";

// Types sûrs côté navigateur (évite HEIC/HEIF qui ne s’affichent pas nativement)
const allowed: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

async function ensureDir() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

export async function POST(req: Request) {
  try {
    await ensureDir();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Fichier manquant (clé 'file')." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const mime = file.type || "application/octet-stream";
    const extFromMime = allowed[mime];
    const originalName = (file as File).name || "";
    const extFromName = path.extname(originalName).toLowerCase();
    const ext = extFromMime || (extFromName && Object.values(allowed).includes(extFromName) ? extFromName : "");

    if (!ext) {
      return new Response(JSON.stringify({ error: "Type de fichier non supporté. Utilise jpg, png, webp ou gif." }), { status: 415, headers: { "Content-Type": "application/json" } });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    if (buf.length > MAX_SIZE) {
      return new Response(JSON.stringify({ error: "Fichier trop volumineux (max 5 Mo)." }), { status: 413, headers: { "Content-Type": "application/json" } });
    }

    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(IMAGES_DIR, filename);
    await fs.writeFile(filepath, buf);

    const publicPath = `${PUBLIC_PREFIX}${filename}`;
    return new Response(JSON.stringify({ path: publicPath, filename }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (e) {
    console.error("Upload failed:", e);
    return new Response(JSON.stringify({ error: "Upload échoué (voir logs serveur)." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDir();
    const { path: publicPath, filename } = await req.json().catch(() => ({}));
    const name = filename ?? (typeof publicPath === "string" && publicPath.startsWith(PUBLIC_PREFIX) ? path.basename(publicPath) : "");
    if (!name) {
      return new Response(JSON.stringify({ error: "Nom de fichier manquant." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const full = path.join(IMAGES_DIR, path.basename(name));
    await fs.unlink(full).catch(() => {});
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("Delete failed:", e);
    return new Response(JSON.stringify({ error: "Suppression échouée (voir logs serveur)." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
