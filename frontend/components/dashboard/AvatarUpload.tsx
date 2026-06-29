"use client";

import { useState, useRef } from "react";

export function AvatarUpload({ initialUrl, onUpload }: { initialUrl?: string | null, onUpload: (file: File) => Promise<void> }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(initialUrl || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFile = (file: File) => {
    if (file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors cursor-pointer ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm opacity-50 text-center px-4">Drag image or click</span>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleChange} className="hidden" />
    </div>
  );
}
