import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/CertificatePage.css';
import '../styles/kiosk-overrides.css';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';

// Shared certificates/awards carousel; activePage chooses which dataset is displayed.
export default function CertificatePage({ activePage = 'certificate', onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const clickTimerRef = useRef(null);
  const pendingClickIndexRef = useRef(null);
  const dragMovedRef = useRef(false);
  const lastPointerClickRef = useRef({ index: null, time: 0 });
  const mode = activePage === 'awards' ? 'awards' : 'certificates';
  const activeSlides = mode === 'certificates' ? certificateSlides : awardSlides;
  const pageTitle = mode === 'certificates' ? 'CERTIFICATE' : 'AWARDS';

  useEffect(() => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    pendingClickIndexRef.current = null;
    lastPointerClickRef.current = { index: null, time: 0 };
    setActiveIndex(0);
    setPreviewIndex(null);
    setDragStart(null);
    setDragDelta(0);

    return () => {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    };
  }, [mode]);

  function moveCertificate(direction) {
    setActiveIndex((current) => (current + direction + activeSlides.length) % activeSlides.length);
  }

  function beginCertificateDrag(event) {
    setDragStart(event.clientX);
    setDragDelta(0);
    dragMovedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateCertificateDrag(event) {
    if (dragStart === null) {
      return;
    }
    const nextDelta = event.clientX - dragStart;
    if (Math.abs(nextDelta) > 8) {
      dragMovedRef.current = true;
    }
    setDragDelta(nextDelta);
  }

  function endCertificateDrag() {
    if (dragStart !== null && Math.abs(dragDelta) > 48) {
      moveCertificate(dragDelta < 0 ? 1 : -1);
    }
    setDragStart(null);
    setDragDelta(0);
  }

  function openCertificatePreview(index) {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    pendingClickIndexRef.current = null;
    setActiveIndex(index);
    setPreviewIndex(index);
  }

  function handleCertificateClick(index, event) {
    if (dragMovedRef.current) {
      return;
    }

    if (event.detail >= 2) {
      openCertificatePreview(index);
      return;
    }

    if (previewIndex !== null) {
      setActiveIndex(index);
      setPreviewIndex(index);
      return;
    }

    if (pendingClickIndexRef.current === index && clickTimerRef.current) {
      openCertificatePreview(index);
      return;
    }

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }

    pendingClickIndexRef.current = index;
    clickTimerRef.current = window.setTimeout(() => {
      setActiveIndex(index);
      pendingClickIndexRef.current = null;
      clickTimerRef.current = null;
    }, 420);
  }

  function handleCertificatePointerDown(index, event) {
    const now = Date.now();
    const lastClick = lastPointerClickRef.current;

    if (lastClick.index === index && now - lastClick.time < 560) {
      event.preventDefault();
      event.stopPropagation();
      lastPointerClickRef.current = { index: null, time: 0 };
      openCertificatePreview(index);
      return;
    }

    lastPointerClickRef.current = { index, time: now };
  }

  function handleCertificateStageDoubleClick(event) {
    const frame = event.target.closest('.certificate-frame');
    if (!frame) {
      return;
    }

    const nextIndex = Number(frame.dataset.certificateIndex);
    if (!Number.isInteger(nextIndex)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    openCertificatePreview(nextIndex);
  }

  const visibleSlides = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (activeIndex + offset + activeSlides.length) % activeSlides.length;
    return { image: activeSlides[index], index, offset };
  });

  return (
    <main className="screen about-screen certificate-screen title-simple-page">
      <section className="about-panel certificate-panel">
        <header className="about-header certificate-header">
          <div className="about-title-bar certificate-title-bar">
            <h1>{pageTitle}</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section
          className={`certificate-stage ${previewIndex !== null ? 'preview-open' : ''}`}
          aria-label={pageTitle}
          onDoubleClickCapture={handleCertificateStageDoubleClick}
        >
          <div
            className={`certificate-carousel ${dragStart !== null ? 'dragging' : ''}`}
            onPointerDown={beginCertificateDrag}
            onPointerMove={updateCertificateDrag}
            onPointerUp={endCertificateDrag}
            onPointerCancel={endCertificateDrag}
            style={{ '--certificate-drag-x': `${dragDelta}px` }}
          >
            <div className="certificate-track" aria-live="polite">
              {visibleSlides.map((slide) => (
                <button
                  key={`${mode}-${slide.image}-${slide.offset}`}
                  className={`certificate-frame offset-${slide.offset}`}
                  data-certificate-index={slide.index}
                  onPointerDownCapture={(event) => handleCertificatePointerDown(slide.index, event)}
                  onClick={(event) => handleCertificateClick(slide.index, event)}
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    openCertificatePreview(slide.index);
                  }}
                  type="button"
                  aria-label={`Show ${mode === 'certificates' ? 'certificate' : 'award'} ${slide.index + 1}`}
                >
                  <img src={slide.image} alt="" draggable="false" />
                </button>
              ))}
            </div>
          </div>

          {previewIndex !== null && (
            <aside className="certificate-preview-panel" aria-label={`Large ${mode === 'certificates' ? 'certificate' : 'award'} preview`}>
              <div className={`certificate-preview-image-wrap ${mode === 'awards' ? 'award-preview-image-wrap' : ''}`}>
                <img
                  className="certificate-preview-image"
                  src={activeSlides[previewIndex]}
                  alt={`${mode === 'certificates' ? 'Certificate' : 'Award'} ${previewIndex + 1}`}
                  draggable="false"
                />
                <button
                  className="certificate-preview-close"
                  type="button"
                  onClick={() => {
                    if (clickTimerRef.current) {
                      window.clearTimeout(clickTimerRef.current);
                      clickTimerRef.current = null;
                    }
                    pendingClickIndexRef.current = null;
                    setPreviewIndex(null);
                  }}
                  aria-label="Close certificate preview"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
            </aside>
          )}
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === activePage ? 'active' : ''}`}
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <img className={item.className || ''} src={item.icon} alt="" />
              <span>{item.shortLabel || item.label}</span>
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}
