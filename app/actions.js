"use server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(file) {

    if (!file) return { error: "No image file provided." };

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    // make sure the folder exists (dev only – it’s not persisted on Vercel)
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });

    await writeFile(path.join(dir, filename), buffer);

    return { success: true, url: `/uploads/${filename}` };
}