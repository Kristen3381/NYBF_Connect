"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Link as LinkIcon,
  Check,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  AlertCircle,
} from "lucide-react";

export interface MediaItemOption {
  id: string;
  title: string;
  thumbnail?: string | null;
  url?: string | null;
  type?: string;
}

const defaultGalleryPhotos = [
  { url: "/pictures/national-townhall.jpeg", label: "National Townhall", category: "Assembly" },
  { url: "/pictures/community-action.jpeg", label: "Community Action", category: "Grassroots" },
  { url: "/pictures/civic-dialogue.jpeg", label: "Civic Dialogue", category: "Dialogue" },
  { url: "/pictures/grassroots-circle.jpeg", label: "Grassroots Circle", category: "Devolution" },
  { url: "/pictures/policy-roundtable.jpeg", label: "Policy Roundtable", category: "Policy" },
  { url: "/pictures/youth-delegates.jpeg", label: "Youth Delegates", category: "Delegates" },
  { url: "/pictures/county-assembly.jpeg", label: "County Assembly", category: "Assembly" },
  { url: "/pictures/budget-hearing.jpeg", label: "Budget Hearing", category: "Hearing" },
  { url: "/pictures/forum-presentation.jpeg", label: "Forum Presentation", category: "Keynote" },
  { url: "/pictures/devolution-clinic.jpeg", label: "Devolution Clinic", category: "Clinic" },
  { url: "/pictures/youth-summit.jpeg", label: "Youth Summit", category: "Summit" },
  { url: "/pictures/economic-forum.jpeg", label: "Economic Forum", category: "Economy" },
  { url: "/pictures/citizen-caucus.jpeg", label: "Citizen Caucus", category: "Caucus" },
];

export function EventImagePicker({
  value,
  onChange,
  mediaItems = [],
}: {
  value: string;
  onChange: (url: string) => void;
  mediaItems?: MediaItemOption[];
}) {
  const [tab, setTab] = useState<"upload" | "gallery" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-use items from media/gallery management
  const mediaPhotos = mediaItems
    .filter((m) => m.thumbnail || (m.type === "IMAGE" && m.url))
    .map((m) => ({
      url: m.thumbnail || m.url!,
      label: m.title,
      category: "Uploaded Media",
    }));

  // Combine uploaded media items and project gallery images (deduplicating URLs)
  const combinedPhotos = [
    ...mediaPhotos,
    ...defaultGalleryPhotos.filter(
      (gp) => !mediaPhotos.some((mp) => mp.url === gp.url)
    ),
  ];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`Photo size (${sizeMB} MB) exceeds maximum allowed limit of 5 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Type validation
    if (!file.type.startsWith("image/")) {
      setUploadError(`Invalid file type (${file.type || "unknown"}). Only image files (JPEG, PNG, WebP, GIF) are accepted.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "image");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setUploadError(data.error || "Failed to upload image. Please try again.");
        return;
      }

      onChange(data.url);
      setUploadSuccess(
        data.provider === "vercel-blob"
          ? "Uploaded photo to Vercel Blob"
          : "Saved locally for development"
      );
    } catch {
      setUploadError("Network error during photo upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-ink/80 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-brand" />
          <span>Event Background Image</span>
        </label>
        <div className="inline-flex rounded-xl border border-line bg-bg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
              tab === "upload"
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <UploadCloud size={12} />
            <span>Upload Device Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("gallery")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
              tab === "gallery"
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <Sparkles size={12} />
            <span>Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
              tab === "url"
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <LinkIcon size={12} />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload event photo"
      />

      {tab === "upload" && (
        <div className="space-y-2">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition cursor-pointer ${
              uploading
                ? "border-brand bg-brand/5 pointer-events-none"
                : "border-line bg-bg hover:border-brand/60 hover:bg-surface"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={24} className="animate-spin text-brand" />
                <span className="text-xs font-semibold text-brand">
                  Uploading event photo to Vercel Blob...
                </span>
                <span className="text-[10px] text-muted">
                  Please wait while the image is securely stored.
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:scale-110 transition">
                  <UploadCloud size={20} />
                </div>
                <div className="text-xs font-bold text-ink">
                  Click or tap to upload photo from your device
                </div>
                <div className="text-[10px] text-muted">
                  Supports JPG, PNG, WebP, GIF • Max 5 MB
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check size={12} />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>
      )}


      {tab === "gallery" ? (
        <div>
          <p className="text-[11px] text-muted mb-2">
            Select from previously uploaded media or official NYBF gallery photos:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 rounded-2xl border border-line bg-bg">
            {combinedPhotos.map((photo) => {
              const isSelected = value === photo.url;
              return (
                <button
                  key={photo.url}
                  type="button"
                  onClick={() => onChange(photo.url)}
                  className={`group relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-md"
                      : "border-transparent hover:border-brand/40 opacity-80 hover:opacity-100"
                  }`}
                  title={photo.label}
                >
                  <Image
                    src={photo.url}
                    alt={photo.label}
                    fill
                    sizes="(max-width: 640px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white truncate leading-tight">
                    {photo.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[11px] text-muted mb-1.5">
            Paste a direct image URL (HTTPS hosted or local public path):
          </p>
          <input
            type="url"
            placeholder="https://example.com/photo.jpg or /pictures/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand"
          />
        </div>
      )}

      {/* Selected Image Background Preview */}
      {value ? (
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl border border-line bg-black/5">
          <Image
            src={value}
            alt="Event Background Preview"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <span className="glass-panel-photo rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Live Card Background Preview
            </span>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <div className="text-[10px] text-emerald-300 font-semibold truncate">
              Preview active background
            </div>
            <div className="font-mono text-[10px] text-white/70 truncate">
              {value}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line p-3 text-center text-xs text-muted">
          No background image selected yet.
        </div>
      )}
    </div>
  );
}
