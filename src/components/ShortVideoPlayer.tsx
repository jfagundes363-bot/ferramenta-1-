import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Check } from 'lucide-react';

export interface VideoSlotData {
  id: number;
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  fallbackPosterUrl?: string;
  status: 'ready' | 'soon';
  duration?: string;
  fileSize?: string;
}

interface ShortVideoPlayerProps {
  slot: VideoSlotData;
  activeVideoId: number | null;
  onPlayChange: (id: number, isPlaying: boolean) => void;
}

export default function ShortVideoPlayer({
  slot,
  activeVideoId,
  onPlayChange
}: ShortVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // If another video starts playing, pause this one
  useEffect(() => {
    if (activeVideoId !== null && activeVideoId !== slot.id && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [activeVideoId, slot.id, isPlaying]);

  // Handle Play / Pause toggle
  const togglePlay = () => {
    if (!slot.videoUrl || !videoRef.current) return;

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onPlayChange(slot.id, true);
      }).catch(err => {
        console.error('Play prevented:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      onPlayChange(slot.id, false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onPlayChange(slot.id, false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Direct download handler
  const handleDownload = (e: React.MouseEvent) => {
    if (!slot.videoUrl) return;
    setIsDownloading(true);
    fetch(slot.videoUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `NoobToon_Short_${slot.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err) => {
        console.warn('Fallback download link used:', err);
      })
      .finally(() => {
        setTimeout(() => setIsDownloading(false), 1500);
      });
  };

  // Placeholder slot if not ready
  if (slot.status === 'soon' || !slot.videoUrl) {
    return (
      <div className="flex flex-col gap-2.5 items-center w-full">
        <div className="relative aspect-[9/16] w-full rounded-2xl border border-dashed border-[var(--purple)]/40 bg-gradient-to-b from-[var(--surface)] to-[var(--surface2)] overflow-hidden flex flex-col items-center justify-center p-4 text-center shadow-lg">
          <div className="w-14 h-10 rounded-2xl bg-zinc-700/60 flex items-center justify-center text-zinc-400">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
          <span className="text-[11px] text-[var(--muted)] mt-2 font-semibold">Em breve</span>
        </div>
      </div>
    );
  }

  // Active Video Slot
  return (
    <div className="flex flex-col gap-2.5 items-center w-full group">
      {/* Video Container (aspect ratio 9:16) */}
      <div 
        className="relative aspect-[9/16] w-full rounded-2xl border-2 border-[var(--pink)] bg-black overflow-hidden shadow-[0_0_24px_rgba(255,95,162,0.35)] select-none cursor-pointer"
        onClick={togglePlay}
        title={isPlaying ? 'Clique para pausar' : 'Clique para assistir'}
      >
        <video
          ref={videoRef}
          src={slot.videoUrl}
          poster={slot.posterUrl}
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />

        {/* Central YouTube Play/Pause Icon */}
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/25 transition-opacity">
            {/* YouTube Red Play Button */}
            <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-2xl bg-[#ff0000] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        ) : (
          /* Subtle Pause icon appears on hover while playing */
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-2xl bg-black/75 border border-white/20 flex items-center justify-center shadow-lg">
              <Pause className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Centered Download Button below video - No play button below, no title text */}
      <div className="flex justify-center w-full pt-0.5">
        <a
          href={slot.videoUrl}
          download={`NoobToon_Short_${slot.id}.mp4`}
          onClick={handleDownload}
          className="w-full max-w-[170px] py-2 px-3 rounded-xl sunset-bg text-[#16061a] font-display text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,95,162,0.25)] hover:shadow-[0_0_20px_rgba(255,95,162,0.45)] hover:-translate-y-0.5 transition-all text-center no-underline cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Baixando...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Baixar Vídeo</span>
            </>
          )}
        </a>
      </div>
    </div>
  );
}
