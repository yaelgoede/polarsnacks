"use client";

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PhotoUploadProps = {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
};

export function PhotoUpload({ onFileSelect, preview, onClear }: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  }

  function handleClear() {
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  }

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={previewUrl}
            alt="Meal preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
        >
          <Camera className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Add a photo</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
