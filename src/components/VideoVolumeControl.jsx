import React, { useEffect, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';
import '../styles/VideoVolumeControl.css';

// Keeps taps and drags on the control from reaching carousels, lock-screen unlock, or lightbox close handlers.
function stopEvent(event) {
  event.stopPropagation();
}

export default function VideoVolumeControl({ videoRef, mediaKey, className = '' }) {
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    function syncFromVideo() {
      setMuted(video.muted || video.volume === 0);
      setVolume(video.volume);
    }

    syncFromVideo();
    video.addEventListener('volumechange', syncFromVideo);
    return () => video.removeEventListener('volumechange', syncFromVideo);
  }, [videoRef, mediaKey]);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    if (muted) {
      if (video.volume === 0) video.volume = 0.5;
      video.muted = false;
      // Unmuting a paused video (e.g. after a blocked autoplay) would otherwise stay silent.
      if (video.paused) video.play().catch(() => {});
    } else {
      video.muted = true;
    }
  }

  function changeVolume(event) {
    const video = videoRef.current;
    if (!video) return;

    const nextVolume = Number(event.target.value);
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
  }

  const shownVolume = muted ? 0 : volume;
  const VolumeIcon = muted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className={`video-volume-control ${className}`.trim()}
      data-video-volume-control=""
      onPointerDown={stopEvent}
      onPointerMove={stopEvent}
      onPointerUp={stopEvent}
      onPointerCancel={stopEvent}
      onTouchStart={stopEvent}
      onClick={stopEvent}
      onKeyDown={stopEvent}
      onWheel={stopEvent}
    >
      <button
        type="button"
        className="video-volume-toggle"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={muted}
      >
        <VolumeIcon aria-hidden="true" />
      </button>
      <input
        type="range"
        className="video-volume-slider"
        min="0"
        max="1"
        step="0.05"
        value={shownVolume}
        onChange={changeVolume}
        style={{ '--volume-fill': `${shownVolume * 100}%` }}
        aria-label="Video volume"
        aria-valuetext={`${Math.round(shownVolume * 100)}%`}
      />
    </div>
  );
}
