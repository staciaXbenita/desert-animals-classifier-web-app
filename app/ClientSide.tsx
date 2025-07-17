"use client";
import React, { useState, useEffect } from "react";
import { classifyImage } from "./actions"; // ← server action
import { UploadForm } from "./components/UploadForm";

export const ClientSide: React.FC = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [prediction, setPred] = useState<{
    label: string;
    confidences: any[];
  } | null>(null);
  const [resultLabel, setResultLabel] = useState<string>("Unknown");
  const [resultConfidences, setResultConfidences] = useState<any[]>([]);
  const [isPredLoading, setIsPredLoading] = useState<boolean>(true);

  useEffect(() => {
    console.info("ClientSide mounted, url:", url);
    if (!url) return;
    (async () => setPred(await classifyImage(url)))();
    setIsPredLoading(true);
  }, [url]);

  useEffect(() => {
    console.info("Prediction updated:", JSON.stringify(prediction, null, 2));
    setResultLabel(prediction?.label || "Unknown");
    setResultConfidences(prediction?.confidences || []);
    setIsPredLoading(false);
  }, [prediction]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <UploadForm setUrl={setUrl} />
        {isPredLoading && 
            <div>
                <p className="text-center mt-4 bg-yellow-100/80 p-4 rounded-lg w-50">
                    Loading prediction...
                </p>
            </div>
        }
        {prediction && !isPredLoading && (
          <div className="text-center mt-4 bg-pink-100/80 p-4 rounded-lg w-50 mb-50">
            <div className="font-bold text-black">prediction result: {resultLabel}</div>
            <ul className="list-disc list-inside">
              {resultConfidences.map((item, index) => (
                <li key={index}>
                  {item.label}: {item.confidence.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
