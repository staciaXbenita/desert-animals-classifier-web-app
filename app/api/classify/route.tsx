import { NextResponse } from "next/server";
import { IncomingForm, File as FormidableFile } from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { client, handleFile } from "@gradio/client";

// Disable Next's default body parser so we can use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: Request): Promise<{ file: FormidableFile }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ maxFileSize: 5 * 1024 * 1024 }); // 5 MB
    form.parse(req as any, (err, _fields, files) => {
      if (err) return reject(err);
      // "file" is the name attribute in the <input>
      const fileData = Array.isArray(files.file) ? files.file[0] : files.file;
      resolve({ file: fileData as FormidableFile });
    });
  });
}

export async function POST(req: Request) {
  try {
    // 1  extract the uploaded file
    const { file } = await parseForm(req);
    if (!file) {
      return NextResponse.json({ error: "no file" }, { status: 400 });
    }

    // 2  move it into /tmp so gradio can read it
    const tmpPath = path.join("/tmp", file.originalFilename!);
    await fs.copyFile(file.filepath, tmpPath);

    // 3  call the Space
    const space = await client("staciabenita/desert-animals-classifier");
    const result = await space.predict("/predict", [handleFile(tmpPath)]);

    // 4  cleanup – optional (Vercel wipes /tmp after the function ends anyway)
    await fs.unlink(tmpPath);

    return NextResponse.json({ result });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}