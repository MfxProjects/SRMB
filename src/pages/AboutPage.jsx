import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/AboutPage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Company overview with a draggable photo gallery and full-screen image viewer.
export default function AboutPage({ onNavigate }) {
  const [selectedPhoto, setSelectedPhoto] = useState(aboutPhotos[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoDragStart, setPhotoDragStart] = useState(null);
  const [photoDragDelta, setPhotoDragDelta] = useState(0);
  const [ignorePhotoClick, setIgnorePhotoClick] = useState(false);
  const [lightboxDragStart, setLightboxDragStart] = useState(null);
  const [lightboxDragDelta, setLightboxDragDelta] = useState(0);
  const currentIndex = useMemo(() => aboutPhotos.indexOf(selectedPhoto), [selectedPhoto]);

  useEffect(() => {
    if (isLightboxOpen || photoDragStart !== null || lightboxDragStart !== null) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSelectedPhoto((currentPhoto) => {
        const nextIndex = (aboutPhotos.indexOf(currentPhoto) + 1) % aboutPhotos.length;
        return aboutPhotos[nextIndex];
      });
    }, 2000);

    return () => window.clearInterval(timer);
  }, [isLightboxOpen, photoDragStart, lightboxDragStart]);

  function showPhoto(index) {
    const nextIndex = (index + aboutPhotos.length) % aboutPhotos.length;
    setSelectedPhoto(aboutPhotos[nextIndex]);
  }

  function movePhoto(direction) {
    showPhoto(currentIndex + direction);
  }

  function beginPhotoDrag(event) {
    setPhotoDragStart(event.clientX);
    setPhotoDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updatePhotoDrag(event) {
    if (photoDragStart === null) {
      return;
    }
    setPhotoDragDelta(event.clientX - photoDragStart);
  }

  function endPhotoDrag() {
    if (photoDragStart !== null && Math.abs(photoDragDelta) > 50) {
      movePhoto(photoDragDelta < 0 ? 1 : -1);
      setIgnorePhotoClick(true);
    }
    setPhotoDragStart(null);
    setPhotoDragDelta(0);
  }

  function openPhotoViewer() {
    if (ignorePhotoClick) {
      setIgnorePhotoClick(false);
      return;
    }
    setIsLightboxOpen(true);
  }

  function beginLightboxDrag(event) {
    setLightboxDragStart(event.clientX);
    setLightboxDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateLightboxDrag(event) {
    if (lightboxDragStart === null) {
      return;
    }
    setLightboxDragDelta(event.clientX - lightboxDragStart);
  }

  function endLightboxDrag() {
    if (lightboxDragStart !== null && Math.abs(lightboxDragDelta) > 58) {
      movePhoto(lightboxDragDelta < 0 ? 1 : -1);
    }
    setLightboxDragStart(null);
    setLightboxDragDelta(0);
  }

  return (
    <main className="screen about-screen about-page">
      <section className="about-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>ABOUT US</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="about-content">
          <div className="photo-card">
            <button
              className={`main-about-photo-button ${photoDragStart !== null ? 'dragging' : ''}`}
              type="button"
              onClick={openPhotoViewer}
              onPointerDown={beginPhotoDrag}
              onPointerMove={updatePhotoDrag}
              onPointerUp={endPhotoDrag}
              onPointerCancel={endPhotoDrag}
              style={{ '--photo-drag-x': `${photoDragDelta}px` }}
              aria-label="Open photo"
            >
              <img
                className="main-about-photo"
                src={selectedPhoto}
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </button>
            <p>Tap to enlarge photos</p>
            <div className="thumb-row" aria-label="About us photos">
              {aboutPhotos.map((photo, index) => (
                <button
                  className={`thumb-button ${index === currentIndex ? 'active' : ''}`}
                  key={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                >
                  <img src={photo} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>

          <article className="about-copy-card">
            <h2>WHO WE ARE?</h2>
            <ul>
              <li>SRMB Srijan Private Limited is a 70+ year old primary steel producer, recognised by the Joint Plant Committee, Ministry of Steel.</li>
              <li>IMS and GreenPro certified with ISO 9001, 14001, and 45001 standards.</li>
              <li>Operates an integrated steel manufacturing unit using captive steel semis.</li>
              <li>Manufactures TMT bars up to Fe-700, D &amp; S grades, low alloy TMT, and structural steel.</li>
            </ul>
            <div className="about-action-buttons" aria-label="About SRMB quick links">
              <button type="button" onClick={() => onNavigate('board-directors')}>Board of Directors&rsquo; Corner</button>
              <button type="button" onClick={() => onNavigate('mission-vision')}>Mission &amp; Vision of SRMB</button>
            </div>
          </article>
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === 'about' ? 'active' : ''}`}
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <img className={item.className || ''} src={item.icon} alt="" />
              <span>{item.shortLabel || item.label}</span>
            </button>
          ))}
        </nav>

        {isLightboxOpen && (
          <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="About us photo viewer">
            <button
              className="lightbox-close"
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close photo viewer"
            >
              ×
            </button>

            <button className="lightbox-nav lightbox-prev" onClick={() => movePhoto(-1)} type="button" aria-label="Previous photo">
              &#8249;
            </button>

            <div
              className={`lightbox-image-wrap ${lightboxDragStart !== null ? 'dragging' : ''}`}
              onPointerDown={beginLightboxDrag}
              onPointerMove={updateLightboxDrag}
              onPointerUp={endLightboxDrag}
              onPointerCancel={endLightboxDrag}
              style={{ '--lightbox-drag-x': `${lightboxDragDelta}px` }}
            >
              <img src={selectedPhoto} alt="" draggable="false" decoding="async" />
            </div>

            <button className="lightbox-nav lightbox-next" onClick={() => movePhoto(1)} type="button" aria-label="Next photo">
              &#8250;
            </button>

            <div className="lightbox-dots" aria-label="Photo slide controls">
              {aboutPhotos.map((photo, index) => (
                <button
                  key={photo}
                  className={index === currentIndex ? 'active' : ''}
                  onClick={() => showPhoto(index)}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
