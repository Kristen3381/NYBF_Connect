"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileAudio,
  FileVideo,
  ImageIcon,
} from "lucide-react";

export interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category: "image" | "audio" | "video";
  accept: string;
  placeholderUrl?: string;
  helperText?: string;
  allowPasteUrl?: boolean;
}

const CATEGORY_CONFIG = {
  image: {
    maxBytes: 5 * 1024 * 1024,
    limitLabel: "5 MB",
    acceptLabel: "JPG, PNG, WebP, GIF",
    btnLabel: "Upload Image",
    icon: ImageIcon,
  },
  audio: {
    maxBytes: 50 * 1024 * 1024,
    limitLabel: "50 MB",
    acceptLabel: "MP3, WAV, M4A, AAC, OGG",
    btnLabel: "Upload Audio",
    icon: FileAudio,
  },
  video: {
    maxBytes: 100 * 1024 * 1024,
    limitLabel: "100 MB",
    acceptLabel: "MP4, WebM, MOV",
    btnLabel: "Upload Video",
    icon: FileVideo,
  },
};

export function FileUploadInput({
  label,
  value,
  onChange,
  category,
  accept,
  placeholderUrl = "",
  helperText,
  allowPasteUrl = true,
}: FileUploadInputProps) {
  // Mode: "upload" (device picker) or "url" (paste link)
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = CATEGORY_CONFIG[category];
  const IconComponent = config.icon;

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessInfo(null);

    // 1. Client-side Size Validation
    if (file.size > config.maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMB} MB) exceeds maximum allowed limit of ${config.limitLabel} for ${category} uploads.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Client-side Executable & Script Rejection
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const banned = [".exe", ".bat", ".cmd", ".sh", ".bin", ".js", ".php", ".py", ".html", ".msi"];
    if (banned.includes(ext)) {
      setError(`Executable and script files (${ext}) cannot be uploaded.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Client-side MIME Type Verification
    if (category === "image" && !file.type.startsWith("image/")) {
      setError(`Invalid file type (${file.type || "unknown"}). Please select an image file.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (category === "audio" && !file.type.startsWith("audio/")) {
      setError(`Invalid file type (${file.type || "unknown"}). Please select an audio file.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (category === "video" && !file.type.startsWith("video/")) {
      setError(`Invalid file type (${file.type || "unknown"}). Please select a video file.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 4. Upload to /api/upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error || "Upload failed. Please check file format and try again.");
        return;
      }

      // 5. Store Hosted URL on Record
      onChange(data.url);
      setSuccessInfo(
        data.provider === "vercel-blob"
          ? "Uploaded to Vercel Blob CDN"
          : "Saved for development (local storage)"
      );
    } catch (err: any) {
      setError(err?.message || "Network error occurred during file upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleClear() {
    onChange("");
    setError(null);
    setSuccessInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {/* Header & Mode Selector */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-ink/80 flex items-center gap-1.5">
          <IconComponent size={14} className="text-brand" />
          <span>{label}</span>
        </label>
        {allowPasteUrl && (
          <div className="inline-flex rounded-xl border border-line bg-bg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                mode === "upload"
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <UploadCloud size={12} />
              <span>Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition flex items-center gap-1 ${
                mode === "url"
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LinkIcon size={12} />
              <span>Paste URL</span>
            </button>
          </div>
        )}
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelected}
        className="hidden"
        aria-label={label}
      />

      {mode === "upload" ? (
        <div className="space-y-2">
          {/* Upload Trigger Area */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition cursor-pointer ${
              uploading
                ? "border-brand bg-brand/5 pointer-events-none"
                : "border-line bg-bg hover:border-brand/60 hover:bg-surface"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={24} className="animate-spin text-brand" />
                <span className="text-xs font-semibold text-brand">
                  Uploading {category} to Vercel Blob...
                </span>
                <span className="text-[10px] text-muted">
                  Please keep this window open while the file transfers.
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:scale-110">
                  <UploadCloud size={20} />
                </div>
                <div className="text-xs font-bold text-ink">
                  Click to choose {category} from device
                </div>
                <div className="text-[10px] text-muted">
                  Supports {config.acceptLabel} • Max {config.limitLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Paste URL Input */
        <div>
          <input
            type="url"
            placeholder={placeholderUrl || "https://..."}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null);
            }}
            className="w-full rounded-2xl border border-line bg-bg p-3 text-xs sm:text-sm text-ink outline-none focus:border-brand font-mono"
          />
        </div>
      )}

      {/* Error Message Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle size={15} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success / Current Value Preview */}
      {value && (
        <div className="rounded-2xl border border-line bg-bg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[80%]">
              <CheckCircle2 size={14} className="shrink-0" />
              <span className="truncate">
                {successInfo || "Active Hosted Resource"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline"
            >
              Remove
            </button>
          </div>

          <div className="font-mono text-[10px] text-muted truncate bg-surface p-1.5 rounded-lg border border-line">
            {value}
          </div>

          {/* Media Previews based on category */}
          {category === "image" && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-black/5">
              <Image
                src={value}
                alt="Selected Image Preview"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          {category === "audio" && (
            <div className="pt-1">
              <audio controls className="w-full h-10 rounded-lg" src={value}>
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {category === "video" && (
            <div className="pt-1">
              {value.includes("youtube.com") || value.includes("youtu.be") || value.includes("vimeo.com") ? (
                <div className="text-[11px] text-muted italic bg-surface p-2 rounded-lg">
                  External streaming video link configured: {value}
                </div>
              ) : (
                <video controls className="w-full max-h-48 rounded-xl bg-black" src={value}>
                  Your browser does not support video playback.
                </video>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
