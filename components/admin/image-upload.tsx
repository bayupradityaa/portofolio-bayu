"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  onUpload: (formData: FormData) => Promise<{ url?: string; error?: string }>;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
};

export function ImageUpload({
  value,
  onChange,
  onUpload,
  accept = "image/png,image/jpeg,image/webp,image/avif,image/gif",
  maxSizeMB = 5,
  className,
  label = "Upload Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Max file size is ${maxSizeMB} MB`);
      return;
    }

    const acceptedTypes = accept.split(",").map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError("File type not supported");
      return;
    }

    setUploading(true);
    setProgress(30);

    const formData = new FormData();
    formData.set("file", file);

    setProgress(60);
    const result = await onUpload(formData);
    setProgress(100);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      onChange(result.url);
    }

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#27272a]">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="400px"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#27272a] bg-[#111113] px-6 py-10 transition-colors",
            dragOver && "border-[#22c55e] bg-[#22c55e]/5",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <>
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#27272a] border-t-[#22c55e]" />
              <p className="mt-3 text-sm text-[#a1a1aa]">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18181b]">
                {dragOver ? <ImageIcon size={20} className="text-[#22c55e]" /> : <Upload size={20} className="text-[#71717a]" />}
              </div>
              <p className="mt-3 text-sm font-medium text-[#a1a1aa]">{label}</p>
              <p className="mt-1 text-xs text-[#71717a]">
                PNG, JPG, WEBP • converted to WebP • Max {maxSizeMB} MB
              </p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {/* Progress bar */}
      {uploading && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#27272a]">
          <div
            className="h-full rounded-full bg-[#22c55e] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
