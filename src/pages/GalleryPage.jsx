import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/GalleryPage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Displays campaign videos and opens the selected item in a full-screen player.
export default function GalleryPage({ onNavigate }) {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <main className="screen about-screen gallery-screen title-simple-page">
      <section className="about-panel gallery-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>MEDIA GALLERY</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="gallery-grid" aria-label="Media gallery videos">
          {galleryVideos.map((video, index) => (
            <button
              className="gallery-video-tile"
              key={video}
              type="button"
              onClick={() => setActiveVideo(video)}
              aria-label={`Open gallery video ${index + 1}`}
            >
              <img
                src={`/assets/gallery/posters/gallery-${index + 1}.webp`}
                alt=""
                loading="lazy"
                decoding="async"
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
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="gallery-lightbox-close"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveVideo(null);
              }}
              aria-label="Close gallery video"
            >
              &times;
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              playsInline
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </section>
    </main>
  );
}
