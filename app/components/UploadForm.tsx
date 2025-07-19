"use client";
import { uploadImage } from "../actions";
import { Upload } from "lucide-react";
import Image from "next/image";
// import { Client, handle_file } from "@gradio/client"; mf cant work here

import React, {
  useRef,
  useState,
  DragEvent,
  FormEvent,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

interface UploadFormProps {
//   onUploadComplete?: (url: string) => void; // NEW
    setUrl: Dispatch<SetStateAction<string | null>>;
}

export const UploadForm: React.FC<UploadFormProps> = ({setUrl}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // local blob
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null); // after upload
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------- create / revoke local blob URL ---------- */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // when remoteUrl changes, use the model to predict the image classification
  // useEffect(() => {
  //     async function classifyImage() {
  //         if (!remoteUrl) return;
  //         try {
  //             const space = await Client.connect("staciabenita/desert-animals-classifier");
  //             const result = await space.predict("/predict", [handle_file(remoteUrl)]);
  //             handle result here (e.g., set state)
  //         } catch (err) {
  //             console.error("Classification error:", err);
  //         }
  //     }
  //     classifyImage();
  // }, [remoteUrl])

  /* ------------------------------------------------------------ */
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

  /* ---------- Handlers ---------- */
  const onFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const valid = imageTypes.includes(file.type);

    if (!valid) {
      setError("Please choose a .jpg, .jpeg or .png image");
      setFileName(null);
      setPreviewUrl(null);
      // clear the hidden input so the user can pick again
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoteUrl(null); // reset previous upload preview
    setValid(true);
  };

  function handleInputChange() {
    onFileSelect(inputRef.current?.files ?? null);
  }

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (inputRef.current) inputRef.current.files = files; // sync hidden input
    onFileSelect(files);
  }
  // if uploadImage returns a URL
    useEffect(() => {
      setUrl(remoteUrl); // call the callback if provided
      console.info("-----Upload successful:", remoteUrl);
    }, [remoteUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error || !inputRef.current?.files?.length) return;

    const file = inputRef.current.files[0];
    setUploading(true);

    

    try {
      /* your server action / fetch call — must return { url: string } */
      const { url } = await uploadImage(file);
      if (!url) {
        throw new Error("Upload failed, no URL returned");
      } else {
        if (url) {
          setRemoteUrl(url);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }

    /* TODO: replace with your real upload logic */
    alert(`Submitting: ${inputRef.current.files[0].name}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm rounded-lg bg-yellow-100 p-4 shadow-xl text-blue-600 selection:text-yellow-700"
    >
      <h1 className="mb-4 text-center text-xl font-semibold">
        🐫 Upload your own image 🏜️
      </h1>
      <p className="text-center text-xs pb-2">
        we can only classify <b>fennec fox, sand cat, meerkat</b>, and{" "}
        <b>prairie dog</b> for the time being
      </p>

      <label
        htmlFor="fileInput"
        className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors ${
          dragOver ? "border-blue-600 bg-blue-50" : "border-slate-300"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Tiny upload icon */}
        <Upload />
        <p>
          Click to choose a file
          <br />
          or drag &amp; drop it here
        </p>

        <input
          id="fileInput"
          ref={inputRef}
          type="file"
          name="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={() => onFileSelect(inputRef.current?.files ?? null)}
        />
      </label>

      {fileName && !error && (
        <p className="mt-2 truncate text-center text-xs">
          Selected: <span className="font-medium">{fileName}</span>
        </p>
      )}
      {error && (
        <p className="mt-2 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {/* ── local preview ───────────────────────────────────────── */}
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Selected preview"
          width={200}
          height={200}
          className="mx-auto mt-4 rounded-md object-contain"
          unoptimized // allow blob: URL without going through the image loader
        />
      )}
      {/* ── uploaded image ─────────────────────────────────────── */}
      {remoteUrl && (
        <div className="mt-6">
          <p className="text-center text-sm font-medium text-green-700">
            Uploaded successfully!
            <br />
            ヾ( ˃ᴗ˂ )◞ • *✰
          </p>
        </div>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!previewUrl || uploading}
      >
        {uploading ? "Uploading…" : "Submit"}
      </button>
    </form>
  );
}
