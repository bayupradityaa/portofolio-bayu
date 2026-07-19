"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, ImageIcon, Star } from "lucide-react";
import { toast } from "sonner";
import {
  uploadProjectImage,
  deleteProjectImage,
  updateProjectImage,
  reorderProjectImages,
  setProjectCover,
} from "@/lib/actions/projects";
import type { ProjectImage } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif";
const MAX_MB = 10;

type ProjectGalleryProps = {
  projectId?: string;
  initialImages: ProjectImage[];
  /** Current cover URL from the project — used to highlight which image is the cover. */
  coverImage?: string;
  /** Called when the cover changes so the parent form can keep its value in sync. */
  onCoverChange?: (url: string) => void;
};

export function ProjectGallery({
  projectId,
  initialImages,
  coverImage,
  onCoverChange,
}: ProjectGalleryProps) {
  const [images, setImages] = useState<ProjectImage[]>(initialImages);
  const [cover, setCover] = useState<string | undefined>(coverImage);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyCover = (url: string) => {
    setCover(url);
    onCoverChange?.(url);
  };

  // New projects have no id yet — gallery is a relational resource that needs one.
  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#27272a] bg-[#0a0a0c] px-6 py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#18181b]">
          <ImageIcon size={20} className="text-[#71717a]" />
        </div>
        <p className="text-sm text-[#a1a1aa]">Save the project first</p>
        <p className="mt-1 text-xs text-[#71717a]">
          You can add gallery images once the project exists.
        </p>
      </div>
    );
  }

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    // Track cover locally: closure state (`images`, `cover`) is stale inside the
    // loop, so we can't rely on it to decide the first-image-becomes-cover case.
    let hasCover = !!cover || images.length > 0;

    setUploading(true);
    for (const file of list) {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name}: max ${MAX_MB} MB`);
        continue;
      }
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProjectImage(projectId, formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.image) {
        const uploaded = result.image;
        setImages((prev) => [...prev, uploaded]);
        // Server auto-sets the very first image as cover — mirror that here,
        // outside the state updater so we never setState the parent mid-render.
        if (!hasCover) {
          applyCover(uploaded.image_url);
          hasCover = true;
        }
      }
    }
    setUploading(false);
  };

  const handleSetCover = async (image: ProjectImage) => {
    const prev = cover;
    applyCover(image.image_url);
    const result = await setProjectCover(image.id);
    if (result.error) {
      toast.error(result.error);
      setCover(prev);
      onCoverChange?.(prev ?? "");
    }
  };

  const handleDelete = async (image: ProjectImage) => {
    const prevImages = images;
    const wasCover = cover === image.image_url;
    const remaining = images.filter((i) => i.id !== image.id);
    setImages(remaining);
    // Cover falls through to the next remaining image (server does the same).
    if (wasCover) applyCover(remaining[0]?.image_url ?? "");

    const result = await deleteProjectImage(image.id);
    if (result.error) {
      toast.error(result.error);
      setImages(prevImages);
      if (wasCover) applyCover(image.image_url);
    }
  };

  const handleFieldBlur = async (
    image: ProjectImage,
    field: "alt" | "caption",
    value: string,
  ) => {
    if ((image[field] ?? "") === value) return;
    setImages((imgs) =>
      imgs.map((i) => (i.id === image.id ? { ...i, [field]: value } : i)),
    );
    const result = await updateProjectImage(image.id, {
      [field]: field === "caption" ? value || null : value,
    });
    if (result.error) toast.error(result.error);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setImages(reordered);
    setDragIndex(null);
    reorderProjectImages(reordered.map((i) => i.id));
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <ul className="space-y-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className={cn(
                "flex gap-3 rounded-xl border bg-[#0a0a0c] p-3 transition-opacity",
                cover === image.image_url ? "border-[#22c55e]/60" : "border-[#27272a]",
                dragIndex === index && "opacity-50",
              )}
            >
              <div className="flex cursor-grab items-center text-[#52525b] active:cursor-grabbing" aria-hidden="true">
                <GripVertical size={16} />
              </div>

              <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg border border-[#27272a]">
                <Image src={image.image_url} alt={image.alt || "Gallery image"} fill sizes="128px" className="object-cover" />
                {cover === image.image_url && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[#09090b]/90 px-2 py-0.5 text-[10px] font-semibold text-[#22c55e]">
                    <Star size={10} className="fill-[#22c55e]" />
                    Cover
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <input
                  defaultValue={image.alt}
                  onBlur={(e) => handleFieldBlur(image, "alt", e.target.value)}
                  placeholder="Alt text (for accessibility)"
                  className="w-full rounded-lg border border-[#27272a] bg-[#111113] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                />
                <input
                  defaultValue={image.caption ?? ""}
                  onBlur={(e) => handleFieldBlur(image, "caption", e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full rounded-lg border border-[#27272a] bg-[#111113] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleSetCover(image)}
                  disabled={cover === image.image_url}
                  title={cover === image.image_url ? "This is the cover" : "Set as cover"}
                  aria-label={cover === image.image_url ? "Current cover" : "Set as cover"}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    cover === image.image_url
                      ? "text-[#22c55e]"
                      : "text-[#71717a] hover:bg-[#18181b] hover:text-[#22c55e]",
                  )}
                >
                  <Star size={16} className={cn(cover === image.image_url && "fill-[#22c55e]")} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(image)}
                  title="Remove image"
                  aria-label="Remove image"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#71717a] transition-colors hover:bg-[#18181b] hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#27272a] bg-[#0a0a0c] px-6 py-8 transition-colors",
          dragOver && "border-[#22c55e] bg-[#22c55e]/5",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <>
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#27272a] border-t-[#22c55e]" />
            <p className="mt-3 text-sm text-[#a1a1aa]">Uploading...</p>
          </>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18181b]">
              <Upload size={18} className="text-[#71717a]" />
            </div>
            <p className="mt-3 text-sm font-medium text-[#a1a1aa]">Add gallery images</p>
            <p className="mt-1 text-xs text-[#71717a]">
              First image becomes the cover • converted to WebP • max {MAX_MB} MB each
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
