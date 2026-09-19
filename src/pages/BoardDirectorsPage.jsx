import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/BoardDirectorsPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, ChevronRight, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Presents director profiles as a swipeable message carousel.
export default function BoardDirectorsPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDragStart, setSlideDragStart] = useState(null);
  const [slideDragDelta, setSlideDragDelta] = useState(0);
  const activeSlide = boardDirectorSlides[activeIndex];

  function showSlide(index) {
    const nextIndex = (index + boardDirectorSlides.length) % boardDirectorSlides.length;
    setActiveIndex(nextIndex);
  }

  function moveSlide(direction) {
    showSlide(activeIndex + direction);
  }

  function beginSlideDrag(event) {
    if (event.target.closest('button')) {
      return;
    }
    setSlideDragStart(event.clientX);
    setSlideDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateSlideDrag(event) {
    if (slideDragStart === null) {
      return;
    }
    setSlideDragDelta(event.clientX - slideDragStart);
  }

  function endSlideDrag() {
    if (slideDragStart !== null && Math.abs(slideDragDelta) > 70) {
      moveSlide(slideDragDelta < 0 ? 1 : -1);
    }
    setSlideDragStart(null);
    setSlideDragDelta(0);
  }

  return (
    <main className="screen about-screen board-directors-screen title-simple-page">
      <section className="about-panel board-directors-panel">
        <header className="about-header board-directors-header">
          <div className="about-title-bar">
            <h1>BOARD OF DIRECTORS' CORNER</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <div className="board-directors-body">
          <div className="director-slide-bar" aria-label="Board director slides">
            <div className="director-member-tabs">
              {boardDirectorSlides.map((slide, index) => (
                <button
                  className={`director-member-tab ${index === activeIndex ? 'active' : ''}`}
                  key={slide.name}
                  type="button"
                  onClick={() => showSlide(index)}
                  aria-label={`Show ${slide.name}`}
                >
                  <span className="director-member-tab-avatar">
                    <img src={slide.image} alt="" aria-hidden="true" loading="lazy" />
                  </span>
                  <span className="director-member-tab-text">
                    <span className="director-member-tab-name">{slide.name}</span>
                    <small>{slide.role}</small>
                  </span>
                  <ChevronRight className="director-member-tab-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
            <button className="director-back-button" type="button" onClick={() => onNavigate('about')} aria-label="Back to About">
              <ArrowLeft aria-hidden="true" />
              <span>Back</span>
            </button>
          </div>

          <section
            className={`board-directors-stage ${activeSlide.showMessage ? 'has-message' : ''} ${slideDragStart !== null ? 'dragging' : ''}`}
            onPointerDown={beginSlideDrag}
            onPointerMove={updateSlideDrag}
            onPointerUp={endSlideDrag}
            onPointerCancel={endSlideDrag}
            style={{ '--director-drag-x': `${slideDragDelta}px` }}
            aria-label={`${activeSlide.name} message slide`}
          >
            <aside className="director-photo-panel director-photo-panel-full">
              <div className="director-photo-frame">
                <img
                  className="director-photo-contain-full"
                  src={activeSlide.image}
                  alt={`${activeSlide.name}, ${activeSlide.role}`}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </aside>

            {activeSlide.showMessage && (
              <article className="director-message-panel">
                <div className="director-message-body">
                  {activeSlide.message.map((paragraph, index) => (
                    <p className={index >= activeSlide.message.length - 1 ? 'director-signature' : ''} key={`${activeSlide.name}-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                  <p className="director-role-line">{activeSlide.role}</p>
                </div>
              </article>
            )}
          </section>
        </div>

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
      </section>
    </main>
  );
}
