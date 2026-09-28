import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Configuration & Validation Limits
const UPLOAD_LIMITS = {
  image: {
    maxBytes: 5 * 1024 * 1024, // 5 MB
    label: "5 MB",
    allowedMimes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
  },
  audio: {
    maxBytes: 50 * 1024 * 1024, // 50 MB
    label: "50 MB",
    allowedMimes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/aac",
      "audio/ogg",
      "audio/webm",
      "audio/flac",
    ],
    allowedExtensions: [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".webm", ".flac"],
  },
  video: {
    maxBytes: 100 * 1024 * 1024, // 100 MB
    label: "100 MB",
    allowedMimes: [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska",
      "video/ogg",
    ],
    allowedExtensions: [".mp4", ".webm", ".mov", ".mkv", ".ogv"],
  },
} as const;

// Strict blocked executable and script extensions
const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".bin",
  ".app",
  ".dmg",
  ".js",
  ".mjs",
  ".ts",
  ".tsx",
  ".php",
  ".py",
  ".pl",
  ".cgi",
  ".html",
  ".htm",
  ".jar",
  ".msi",
  ".dll",
  ".vbs",
  ".ps1",
]);

export async function POST(req: Request) {
  try {
    // 1. Authorization: Require authenticated ADMIN or COORDINATOR session
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "COORDINATOR") {
      return NextResponse.json(
        { error: "Forbidden: Admin or Coordinator privileges required for file upload" },
        { status: 403 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawCategory = (formData.get("category") as string)?.toLowerCase() || "auto";

    if (!file || typeof file === "string" || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided for upload" }, { status: 400 });
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();
    const mimeType = file.type?.toLowerCase() || "";

    // 3. Reject forbidden executable extensions
    if (BLOCKED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable and script files (${ext}) are strictly prohibited for security.` },
        { status: 400 }
      );
    }

    // 4. Determine category and validation rules
    let category: "image" | "audio" | "video";
    if (rawCategory === "image" || rawCategory === "audio" || rawCategory === "video") {
      category = rawCategory;
    } else {
      // Auto-detect based on MIME type or extension
      if (mimeType.startsWith("image/") || (UPLOAD_LIMITS.image.allowedExtensions as readonly string[]).includes(ext)) {
        category = "image";
      } else if (mimeType.startsWith("audio/") || (UPLOAD_LIMITS.audio.allowedExtensions as readonly string[]).includes(ext)) {
        category = "audio";
      } else if (mimeType.startsWith("video/") || (UPLOAD_LIMITS.video.allowedExtensions as readonly string[]).includes(ext)) {
        category = "video";
      } else {
        return NextResponse.json(
          {
            error:
              "Unsupported file type. Please upload a valid image (JPEG, PNG, WebP, GIF), audio (MP3, WAV, M4A), or video (MP4, WebM, MOV).",
          },
          { status: 400 }
        );
      }
    }

    const rules = UPLOAD_LIMITS[category];

    // 5. Validate MIME and extension match the target category
    const mimeValid = (rules.allowedMimes as readonly string[]).includes(mimeType);
    const extValid = (rules.allowedExtensions as readonly string[]).includes(ext);

    if (!mimeValid && !extValid) {
      return NextResponse.json(
        {
          error: `Invalid file format for ${category}. Expected one of: ${(rules.allowedExtensions as readonly string[]).join(
            ", "
          )}. Received ${mimeType || ext || "unknown"}.`,
        },
        { status: 400 }
      );
    }

    // 6. Validate File Size
    if (file.size > rules.maxBytes) {
      const actualSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          error: `File size (${actualSizeMB} MB) exceeds the maximum allowed limit of ${rules.label} for ${category} uploads.`,
        },
        { status: 400 }
      );
    }

    // 7. Generate safe unique filename
    const sanitizedBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const safeFilename = `${sanitizedBase}-${uniqueSuffix}${ext}`;
    const blobPathname = `uploads/${category}/${safeFilename}`;

    // 8. Upload to Storage Backend
    // Vercel Blob supports two authentication methods in @vercel/blob:
    //  a) Platform-managed OIDC auth: BLOB_STORE_ID + Vercel ambient OIDC token (VERCEL_OIDC_TOKEN)
    //  b) Static token auth: BLOB_READ_WRITE_TOKEN
    const isBlobConfigured = Boolean(
      process.env.BLOB_STORE_ID ||
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.VERCEL_OIDC_TOKEN
    );

    if (isBlobConfigured || process.env.NODE_ENV === "production") {
      if (!isBlobConfigured) {
        return NextResponse.json(
          {
            error:
              "Vercel Blob storage is not configured. Please ensure your Vercel Blob store is connected (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN in environment variables).",
          },
          { status: 500 }
        );
      }

      const putOptions: {
        access: "public";
        contentType?: string;
        storeId?: string;
        token?: string;
      } = {
        access: "public",
        contentType: mimeType || undefined,
      };

      if (process.env.BLOB_STORE_ID) {
        putOptions.storeId = process.env.BLOB_STORE_ID;
      }
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        putOptions.token = process.env.BLOB_READ_WRITE_TOKEN;
      }

      const blob = await put(blobPathname, file, putOptions);

      return NextResponse.json({
        success: true,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: file.size,
        provider: "vercel-blob",
      });
    }

    // Local dev fallback: Save to public/uploads/ when Blob storage is not configured
    const devUploadsDir = path.join(process.cwd(), "public", "uploads", category);
    await fs.promises.mkdir(devUploadsDir, { recursive: true });
    const localFilePath = path.join(devUploadsDir, safeFilename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(localFilePath, Buffer.from(arrayBuffer));

    const localUrl = `/uploads/${category}/${safeFilename}`;
    return NextResponse.json({
      success: true,
      url: localUrl,
      pathname: localUrl,
      contentType: mimeType,
      size: file.size,
      provider: "local-dev-fallback",
      warning:
        "Saved to local public/uploads/ because Vercel Blob is not configured. For production CDN hosting, connect a Vercel Blob store.",
    });
  } catch (error: any) {
    console.error("[Upload API] error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload" },
      { status: 500 }
    );
  }
}
