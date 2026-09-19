import React, { useEffect, useRef, useState } from 'react';
import '../styles/pages/GalleryPage.css';
import '../styles/kiosk-overrides.css';
import { Play, X } from 'lucide-react';
import { navItems, galleryVideos } from '../data/appData.jsx';

// Displays campaign videos as autoplaying muted previews and opens the selected item in a full-screen player.
export default function GalleryPage({ onNavigate }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const lightboxRef = useRef(null);
  const activeVideoRef = useRef(null);

  function normalizeMediaUrl(value) {
    try {
      return encodeURI(decodeURI(value));
    } catch {
      return encodeURI(value);
    }
  }

  useEffect(() => {
    if (activeVideo && lightboxRef.current?.requestFullscreen) {
      lightboxRef.current.requestFullscreen().catch(() => {});
    }

    if (activeVideo && activeVideoRef.current?.play) {
      activeVideoRef.current.play().catch(() => {});
    }
  }, [activeVideo]);

  useEffect(() => {
    function syncWithFullscreenExit() {
      if (!document.fullscreenElement) {
        setActiveVideo(null);
      }
    }

    document.addEventListener('fullscreenchange', syncWithFullscreenExit);
    return () => document.removeEventListener('fullscreenchange', syncWithFullscreenExit);
  }, []);

  function closeLightbox() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    setActiveVideo(null);
  }

  return (
    <main className="screen about-screen gallery-screen title-simple-page">
      <section className="about-panel gallery-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>GALLERY</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="gallery-grid" aria-label="Media gallery videos">
          {galleryVideos.map((video) => (
            <button
              className="gallery-media-tile"
              key={video.src}
              type="button"
              onClick={() => setActiveVideo(video)}
              aria-label={`Play ${video.title}`}
            >
              <video
                src={normalizeMediaUrl(video.src)}
                poster={video.poster || undefined}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <span className="gallery-play-dot" aria-hidden="true">
                <Play fill="currentColor" strokeWidth={1.8} />
              </span>
            </button>
          ))}
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === 'gallery' ? 'active' : ''}`}
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <img className={item.className || ''} src={item.icon} alt="" />
              <span>{item.shortLabel || item.label}</span>
            </button>
          ))}
        </nav>

        {activeVideo && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery video viewer"
            ref={lightboxRef}
            onClick={closeLightbox}
          >
            <button
              className="gallery-lightbox-close"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close gallery video"
            >
              <X strokeWidth={2} />
            </button>
            <div className="gallery-lightbox-frame" onClick={(event) => event.stopPropagation()}>
              <video
                key={activeVideo.src}
                ref={activeVideoRef}
                src={normalizeMediaUrl(activeVideo.src)}
                controls
                autoPlay
                playsInline
              />
              <span className="gallery-lightbox-title">{activeVideo.title}</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
