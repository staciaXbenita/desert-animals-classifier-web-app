"use server";
import { mkdir, writeFile, rm } from "fs/promises";
import path from "path";
import { Client, handle_file } from "@gradio/client";

export async function uploadImage(file: File) {
    if (!file) {
      console.log("No file provided for upload.");
      return { error: "No image file provided." };
    }
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    // const filename = "img";
    // make sure the folder exists (dev only – it’s not persisted on Vercel)
    const dir = path.join(process.cwd(), "public", "uploads");
    // remove all files in the uploads folder
    await rm(dir, { recursive: true, force: true }).catch(() => {});
    // recreate the (now empty) directory
    await mkdir(dir, { recursive: true });
    // save new image
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    return { success: true, url: `public/uploads/${filename}` };
}

export async function classifyImage(localPath: string) {
  const space  = await Client.connect("staciabenita/desert-animals-classifier");
  const result = await space.predict("/predict", [handle_file(localPath)]);
  const { label, confidences } = result.data[0];
  return { label, confidences };
}