"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  // 进入视口自动播放：静音 + 循环（单视频循环必须带 playlist 参数），满足浏览器自动播放策略
  const autoPlayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
  // 点击播放后备：不静音
  const clickPlayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;

  const containerRef = useRef<HTMLDivElement>(null);
  // embedUrl 一旦挂载永不切换（避免换 src 触发 iframe 重载、取消静音）
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEmbedUrl((prev) => prev ?? autoPlayUrl);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlayUrl]);

  return (
    <div ref={containerRef} className="space-y-4">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-border bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {embedUrl ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setEmbedUrl(clickPlayUrl)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
            />
            <span
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center
                            rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg
                            transition-transform group-hover:scale-110"
            >
              <Play className="h-8 w-8 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
