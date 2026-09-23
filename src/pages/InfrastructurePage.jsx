import React, { useEffect, useRef, useState } from 'react';
import '../styles/pages/InfrastructurePage.css';
import '../styles/kiosk-overrides.css';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clapperboard,
  ExternalLink,
  Factory,
  FileText,
  Map,
  MapPin,
} from 'lucide-react';
import {
  corporateOfficeAddress,
  corporateOfficeEmbedUrl,
  corporateOfficeMapsUrl,
  manufacturingPlantMapLinks,
  navItems,
} from '../data/appData.jsx';
import VideoVolumeControl from '../components/VideoVolumeControl.jsx';

// ── Constants ─────────────────────────────────────────────────────────────────
const CORP_AV   = '/assets/corporate av/srmb-corporate-av-compressed.mp4';
const PFD_SLIDES = [
  '/assets/pfd/slides/Slide1.PNG',
  '/assets/pfd/slides/Slide2.PNG',
];

function toSec(m, s) { return m * 60 + s; }

// 4 sidebar buttons
const BUTTONS = [
  {
    id: 'corp-video',
    group: 'Corporate Office',
    GroupIcon: Building2,
    label: 'Office Tour',
    sub: 'Corporate AV  •  5:40 – 6:06',
    Icon: Clapperboard,
    accent: 'gold',
  },
  {
    id: 'corp-maps',
    group: 'Corporate Office',
    GroupIcon: Building2,
    label: 'Google Maps',
    sub: 'View office location',
    Icon: Map,
    accent: 'gold',
  },
  {
    id: 'mfg-video',
    group: 'Manufacturing Facility',
    GroupIcon: Factory,
    label: 'Facility Tour',
    sub: 'Corporate AV  •  2:36 – 3:40',
    Icon: Clapperboard,
    accent: 'steel',
  },
  {
    id: 'mfg-pfd',
    group: 'Manufacturing Facility',
    GroupIcon: Factory,
    label: 'Process Flow Diagram',
    sub: 'Browse the production flow',
    Icon: FileText,
    accent: 'steel',
  },
];

// ── Clipped video panel ───────────────────────────────────────────────────────
function VideoPanel({ startTime, endTime }) {
  const videoRef = useRef(null);
  const startRef  = useRef(startTime);
  const endRef    = useRef(endTime);

  // Update refs when props change so the event handler uses latest values
  useEffect(() => {
    startRef.current = startTime;
    endRef.current   = endTime;
  }, [startTime, endTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset and seek every time startTime changes
    video.pause();
    video.currentTime = startTime;

    function onSeeked() {
      video.play().catch(() => {});
    }

    function onTimeUpdate() {
      if (video.currentTime >= endRef.current) {
        video.pause();
        video.currentTime = startRef.current;
      }
    }

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  return (
    <div className="infra-left-video">
      <video
        ref={videoRef}
        className="infra-main-video"
        src={CORP_AV}
        preload="auto"
        controls
        aria-label="Infrastructure video"
      />
      <VideoVolumeControl videoRef={videoRef} mediaKey={CORP_AV} />
    </div>
  );
}

// ── Map panel ─────────────────────────────────────────────────────────────────
const MAP_LOCATIONS = [
  { name: 'Corporate Office', mapsUrl: corporateOfficeMapsUrl, embedUrl: corporateOfficeEmbedUrl, address: corporateOfficeAddress },
  ...manufacturingPlantMapLinks,
];

function MapPanel({ activeLocationIndex }) {
  const activeLocation = MAP_LOCATIONS[activeLocationIndex];

  return (
    <div className="infra-left-map">
      <div className="infra-map-toolbar">
        <span className="infra-map-label">
          <Map size={15} strokeWidth={2.4} />
          {activeLocation.name} — Google Maps
        </span>
        <a
          href={activeLocation.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="infra-map-ext-btn"
          aria-label="Open in Google Maps"
        >
          <ExternalLink size={15} strokeWidth={2.4} />
          Open in Maps
        </a>
      </div>
      <div className="infra-map-frame-wrap">
        <iframe
          key={activeLocation.name}
          className="infra-map-iframe"
          title={`${activeLocation.name} Location`}
          src={activeLocation.embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="infra-map-info-card" key={`card-${activeLocation.name}`}>
          <span className="infra-map-info-pin">
            <MapPin size={16} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <div className="infra-map-info-body">
            <strong>{activeLocation.name}</strong>
            {activeLocation.address && <small>{activeLocation.address}</small>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PFD panel ─────────────────────────────────────────────────────────────────
function PfdPanel() {
  const [slides, setSlides] = useState(PFD_SLIDES);
  const [slideIndex, setSlideIndex] = useState(0);
  const touchStartX = useRef(null);
  const slideCount = slides.length;

  useEffect(() => {
    let cancelled = false;

    fetch('/assets/pfd/slides/manifest.json')
      .then((response) => {
        if (!response.ok) throw new Error('PFD slide manifest is unavailable');
        return response.json();
      })
      .then((manifest) => {
        if (!cancelled && Array.isArray(manifest.slides) && manifest.slides.length > 0) {
          setSlides(manifest.slides);
          setSlideIndex(0);
        }
      })
      .catch(() => {
        // Keep the bundled two-slide fallback if the manifest cannot be read.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const showPrevious = () => {
    setSlideIndex((current) => (current - 1 + slideCount) % slideCount);
  };

  const showNext = () => {
    setSlideIndex((current) => (current + 1) % slideCount);
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 48) return;
    if (distance > 0) showPrevious();
    else showNext();
  }

  return (
    <div className="infra-left-pfd">
      <div className="infra-pfd-toolbar">
        <span className="infra-pfd-title">
          <FileText size={15} strokeWidth={2.2} aria-hidden="true" />
          Process Flow Diagram
        </span>
        <span className="infra-pfd-count" aria-live="polite">
          {slideIndex + 1} / {slideCount}
        </span>
      </div>

      <div
        className="infra-pfd-stage"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="infra-pfd-arrow infra-pfd-arrow--previous"
          type="button"
          onClick={showPrevious}
          aria-label="Show previous PFD slide"
        >
          <ArrowLeft aria-hidden="true" />
        </button>

        <img
          className="infra-pfd-slide"
          src={slides[slideIndex]}
          alt={`SRMB manufacturing process flow diagram, slide ${slideIndex + 1} of ${slideCount}`}
          draggable="false"
        />

        <button
          className="infra-pfd-arrow infra-pfd-arrow--next"
          type="button"
          onClick={showNext}
          aria-label="Show next PFD slide"
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      <div className="infra-pfd-filmstrip" aria-label="PFD slides">
        {slides.map((slide, index) => (
          <button
            key={slide}
            type="button"
            className={`infra-pfd-thumbnail${index === slideIndex ? ' infra-pfd-thumbnail--active' : ''}`}
            onClick={() => setSlideIndex(index)}
            aria-label={`Show PFD slide ${index + 1}`}
            aria-pressed={index === slideIndex}
          >
            <img src={slide} alt="" draggable="false" />
            <span>{index + 1}</span>
          </button>
        ))}
        <div className="infra-pfd-hint">
          <ArrowLeft size={13} aria-hidden="true" />
          <span>Swipe or use arrows</span>
          <ArrowRight size={13} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InfrastructurePage({ onNavigate }) {
  const [active, setActive] = useState('corp-video');
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  // What to render in the left panel
  function renderLeft() {
    switch (active) {
      case 'corp-video':
        return <VideoPanel startTime={toSec(5, 40)} endTime={toSec(6, 6)} />;
      case 'mfg-video':
        return <VideoPanel startTime={toSec(2, 36)} endTime={toSec(3, 40)} />;
      case 'corp-maps':
        return <MapPanel activeLocationIndex={activeLocationIndex} />;
      case 'mfg-pfd':
        return <PfdPanel />;
      default:
        return <VideoPanel startTime={toSec(5, 40)} endTime={toSec(6, 6)} />;
    }
  }

  // Group buttons by category
  const groups = [
    { key: 'Corporate Office',       icon: Building2, ids: ['corp-video', 'corp-maps'] },
    { key: 'Manufacturing Facility', icon: Factory,   ids: ['mfg-video', 'mfg-pfd']   },
  ];

  return (
    <main className="screen about-screen infrastructure-screen title-simple-page">
      <section className="about-panel infrastructure-panel">

        {/* ── Header ── */}
        <header className="about-header infrastructure-header">
          <div className="about-title-bar infrastructure-title-bar">
            <h1>INFRASTRUCTURE</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        {/* ── Body: left panel + right buttons ── */}
        <section className="infrastructure-content" aria-label="Infrastructure">
          {/* LEFT — dynamic content area */}
          <div className="infra-left-panel" aria-live="polite">
            {renderLeft()}
          </div>

          {/* RIGHT — 4 grouped buttons */}
          <aside className="infra-right-panel" aria-label="Infrastructure sections">
            {groups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div className="infra-group" key={group.key}>
                  <div className="infra-group-label">
                    <GroupIcon size={14} strokeWidth={2.4} aria-hidden="true" />
                    <span>{group.key}</span>
                  </div>
                  <div className="infra-group-btns">
                    {BUTTONS.filter((b) => group.ids.includes(b.id)).map((btn) => {
                      const BtnIcon = btn.Icon;
                      const isActive = active === btn.id;
                      return (
                        <React.Fragment key={btn.id}>
                          <button
                            type="button"
                            className={`infra-btn infra-btn--${btn.accent}${isActive ? ' infra-btn--active' : ''}`}
                            onClick={() => setActive(btn.id)}
                            aria-pressed={isActive}
                          >
                            <span className="infra-btn__icon">
                              <BtnIcon aria-hidden="true" />
                            </span>
                            <span className="infra-btn__copy">
                              <strong>{btn.label}</strong>
                              <small>{btn.sub}</small>
                            </span>
                            {isActive && <span className="infra-btn__dot" aria-hidden="true" />}
                          </button>

                          {btn.id === 'corp-maps' && isActive && (
                            <ul className="infra-map-locations" aria-label="SRMB locations on Google Maps">
                              {MAP_LOCATIONS.map((location, index) => (
                                <li key={location.name}>
                                  <button
                                    type="button"
                                    className={`infra-map-location-btn${index === activeLocationIndex ? ' active' : ''}`}
                                    onClick={() => setActiveLocationIndex(index)}
                                    aria-pressed={index === activeLocationIndex}
                                  >
                                    {location.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </aside>
        </section>

        {/* ── Bottom nav ── */}
        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === 'infrastructure' ? 'active' : ''}`}
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
