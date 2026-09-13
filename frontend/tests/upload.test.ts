import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as uploadHandler } from "@/app/api/upload/route";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock @vercel/blob
vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
}));

describe("POST /api/upload — File Uploads & Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  function createMockRequest(file: File | null, category?: string) {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (category) {
      formData.append("category", category);
    }

    return {
      formData: async () => formData,
    } as unknown as Request;
  }

  it("rejects unauthenticated requests with 401", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const file = new File(["test image content"], "photo.jpg", { type: "image/jpeg" });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Authentication required");
  });

  it("rejects non-admin/non-coordinator users with 403", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "member@nybf.ke", role: "MEMBER" },
    } as any);

    const file = new File(["test image content"], "photo.jpg", { type: "image/jpeg" });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain("Admin or Coordinator privileges required");
  });

  it("rejects requests missing a file with 400", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "admin-1", email: "nybfsecretariat@gmail.com", role: "ADMIN" },
    } as any);

    const req = createMockRequest(null, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("No file provided for upload");
  });

  it("rejects executable files (.exe, .sh, .bat) with 400", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "admin-1", email: "nybfsecretariat@gmail.com", role: "ADMIN" },
    } as any);

    const file = new File(["malicious binary payload"], "trojan.exe", {
      type: "application/x-msdownload",
    });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Executable and script files (.exe) are strictly prohibited");
  });

  it("rejects files exceeding image size limit (5 MB) with 400", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "admin-1", email: "nybfsecretariat@gmail.com", role: "ADMIN" },
    } as any);

    // Create a 6MB dummy file
    const oversizedBlob = new Uint8Array(6 * 1024 * 1024);
    const file = new File([oversizedBlob], "huge-poster.jpg", { type: "image/jpeg" });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("exceeds the maximum allowed limit of 5 MB");
  });

  it("rejects wrong MIME format for the selected category with 400", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "admin-1", email: "nybfsecretariat@gmail.com", role: "ADMIN" },
    } as any);

    // Uploading a video file into category=image
    const file = new File(["video clip data"], "clip.mp4", { type: "video/mp4" });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Invalid file format for image");
  });

  it("successfully uploads to Vercel Blob when BLOB_READ_WRITE_TOKEN is set", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token_12345";

    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: "admin-1", email: "nybfsecretariat@gmail.com", role: "ADMIN" },
    } as any);

    vi.mocked(put).mockResolvedValueOnce({
      url: "https://abc123xyz.public.blob.vercel-storage.com/uploads/image/townhall-test.jpg",
      downloadUrl: "https://abc123xyz.public.blob.vercel-storage.com/uploads/image/townhall-test.jpg?download=1",
      pathname: "uploads/image/townhall-test.jpg",
      contentType: "image/jpeg",
      contentDisposition: 'inline; filename="townhall-test.jpg"',
      etag: '"test-etag-123"',
    });

    const file = new File(["valid image data"], "townhall.jpg", { type: "image/jpeg" });
    const req = createMockRequest(file, "image");

    const res = await uploadHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.provider).toBe("vercel-blob");
    expect(data.url).toContain("https://abc123xyz.public.blob.vercel-storage.com");
    expect(put).toHaveBeenCalledWith(
      expect.stringContaining("uploads/image/townhall"),
      expect.any(File),
      expect.objectContaining({
        access: "public",
        token: "vercel_blob_rw_test_token_12345",
      })
    );
  });
});
