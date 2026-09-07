"use client";

import { Download, Check } from "lucide-react";
import { useState } from "react";

export function DownloadGuideButton({
  moduleTitle,
  moduleOrder,
}: {
  moduleTitle: string;
  moduleOrder: number;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 200);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
      title={`Download PDF Guide for Module ${moduleOrder}`}
    >
      <Download size={14} className="text-brand" />
      <span>{downloading ? "Preparing PDF..." : "Download Citizen Guide (PDF)"}</span>
    </button>
  );
}
