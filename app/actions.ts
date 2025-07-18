"use server";
import { put } from "@vercel/blob";   
import { tmpdir } from "os";
import crypto from "crypto";
import { mkdir, writeFile, rm, unlink } from "fs/promises";
import path from "path";
import { Client, handle_file } from "@gradio/client";


// uploadImage using local storage
// export async function uploadImage(file: File) {
//     if (!file) {
//       console.log("No file provided for upload.");
//       return { error: "No image file provided." };
//     }
//     const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
//     // const filename = "img";
//     // make sure the folder exists (dev only – it’s not persisted on Vercel)
//     const dir = path.join(process.cwd(), "public", "uploads");
//     // remove all files in the uploads folder
//     await rm(dir, { recursive: true, force: true }).catch(() => {});
//     // recreate the (now empty) directory
//     await mkdir(dir, { recursive: true });
//     // save new image
//     const buffer = Buffer.from(await file.arrayBuffer());
//     await writeFile(path.join(dir, filename), buffer);

//     return { success: true, url: `public/uploads/${filename}` };
// }
// export async function classifyImage(localPath: string) {
//   const space  = await Client.connect("staciabenita/desert-animals-classifier");
//   const result = await space.predict("/predict", [handle_file(localPath)]);
//   const { label, confidences } = result.data[0];
//   return { label, confidences };
// }

/* ────────────────────────────────────────────── */
/* 1.  uploadImage → Vercel Blob                 */
/* ────────────────────────────────────────────── */
export async function uploadImage(file: File) {
  if (!file) {
    console.error("No file provided for upload.");
    return { error: "No image file provided." };
  }

  /* create a unique, URL-safe name */
  const ext       = file.name.split(".").pop() || "bin";
  const filename  = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  /* ⬇️  push the raw bytes to Vercel Blob */
  const { url } = await put(
    filename,
    await file.arrayBuffer(),     // accepts ArrayBuffer / Buffer / ReadableStream
    { access: "public" }          // make it publicly accessible
  );

  return { success: true, url };  // url is a https://blob.vercel-storage.com/… link
}

/* ────────────────────────────────────────────── */
/* 2.  classifyImage → works from the Blob URL   */
/*     (downloads to /tmp first)                 */
/* ────────────────────────────────────────────── */
export async function classifyImage(blobUrl: string) {
  /* 2-a  download */
  console.log("Blob URL:", blobUrl);
  const res        = await fetch(blobUrl);
  if (!res.ok) throw new Error(`Unable to download image: ${res.statusText}`);

  const arrayBuf   = await res.arrayBuffer();
  const tempPath   = path.join(tmpdir(), `${crypto.randomUUID()}.img`);
  await writeFile(tempPath, Buffer.from(arrayBuf));

  try {
    /* 2-b  Gradio call */
    const space    = await Client.connect("staciabenita/desert-animals-classifier");
    const result   = await space.predict("/predict", [handle_file(tempPath)]);
    const { label, confidences } = result.data[0];
    return { label, confidences };
  } finally {
    /* 2-c  cleanup */
    await unlink(tempPath).catch(() => {});
  }
}