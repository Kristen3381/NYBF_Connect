"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const heroPhotos = [
  {
    src: "/pictures/rally-flags.jpeg",
    alt: "Young Kenyans raising national flags demanding budget transparency",
    tag: "Civic Movement",
    location: "Nairobi, Kenya",
  },
  {
    src: "/pictures/roundtable-overhead.jpeg",
    alt: "Overhead view of youth leaders collaborating on NYBF Connect budget policy documents",
    tag: "Policy Strategy",
    location: "National Forum",
  },
  {
    src: "/pictures/panel-speech.jpeg",
    alt: "Young Kenyan delegate speaking into microphone at budget consultation panel",
    tag: "Youth Voice",
    location: "Consultation Stage",
  },
  {
    src: "/pictures/auditorium-crowd.jpeg",
    alt: "Packed auditorium of Kenyan youth participating in national economic debate",
    tag: "Devolution Townhall",
    location: "47 Counties",
  },
  {
    src: "/pictures/field-circle.jpeg",
    alt: "Grassroots youth group in a discussion circle in an open field",
    tag: "Grassroots Pulse",
    location: "Community Hub",
  },
  {
    src: "/pictures/leaders-exterior.jpeg",
    alt: "Group portrait of NYBF youth delegates outside conference venue",
    tag: "Leadership Network",
    location: "Nairobi Headquarters",
  },
];

export function HeroPhotoCollage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % heroPhotos.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-dark">
      {/* Background Crossfade */}
      {heroPhotos.map((photo, i) => (
        <div
          key={photo.src}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-cover object-center transition-transform duration-[8000ms] ease-out"
            style={{
              transform: i === index ? "scale(1.05)" : "scale(1.0)",
            }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Double layer scrim: Guaranteed WCAG AAA contrast regardless of photo brightness */}
      <div className="scrim-hero absolute inset-0" />
      <div className="scrim-bottom absolute inset-0" />

      {/* Subtle organic noise/mesh overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Bottom photo metadata & manual switcher pills */}
      <div className="absolute bottom-4 right-6 z-20 hidden items-center gap-3 md:flex">
        <div className="glass-panel-photo flex items-center gap-2 rounded-full px-3.5 py-1 text-xs text-white/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">{heroPhotos[index].tag}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/70">{heroPhotos[index].location}</span>
        </div>

        <div className="glass-panel-photo flex items-center gap-1.5 rounded-full p-1.5">
          {heroPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
