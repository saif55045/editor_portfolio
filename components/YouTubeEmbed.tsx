"use client";
import { useState } from "react";

/**
 * Click-to-load YouTube player. Until the visitor presses play nothing from YouTube is loaded
 * (no extra JS, no cookies), and the privacy-friendly youtube-nocookie.com domain is used.
 * Put it inside a positioned box with the same aspect ratio as the video (e.g. 9:16) and the
 * picture fills it with no black bars.
 */
export default function YouTubeEmbed({ id, title, poster }: { id: string; title: string; poster?: string }) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  return (
    <button onClick={() => setPlay(true)} aria-label={`Play ${title}`} data-cursor="play" className="group absolute inset-0 grid place-items-center">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <span className="glass relative grid h-20 w-20 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110">
        <svg width="22" height="22" viewBox="0 0 14 14" fill="currentColor" aria-hidden><path d="M3 1.5v11l9-5.5z" /></svg>
      </span>
    </button>
  );
}
