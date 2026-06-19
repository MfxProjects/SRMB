import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/InfrastructurePage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Infrastructure overview with factory information, video, and location map popups.
export default function InfrastructurePage({ onNavigate }) {
  const [activeMap, setActiveMap] = useState(null);
  const closeMap = () => setActiveMap(null);

  return (
    <main className="screen about-screen infrastructure-screen title-simple-page">
      <section className="about-panel infrastructure-panel">
        <header className="about-header infrastructure-header">
          <div className="about-title-bar infrastructure-title-bar">
            <h1>INFRASTRUCTURE</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="infrastructure-content" aria-label="Infrastructure">
          <aside className="infra-left-actions">
            <button type="button">CORPORATE<br />OFFICE</button>
            <button className="active" type="button">DURGAPUR<br />PLANT</button>
            <p>Click to view images</p>
          </aside>

          <article className="infra-video-card">
            <video
              className="infra-video"
              src={infrastructureVideo}
              controls
              preload="metadata"
            />
            <h2>
              Modern Integrated Steel Manufacturing Unit located at<br />
              Durgapur,<br />
              West Bengal under SRMB Srijan Private Limited
            </h2>
            <div className="infra-pager" aria-hidden="true">
              <span />
              <span />
            </div>
          </article>

          <aside className="infra-location-actions">
            <button
              type="button"
              aria-label="View corporate office location"
              onClick={() => setActiveMap('corporate')}
            >
              <GoogleMapsIcon />
              <span className="google-map-label">Google Maps</span>
              <span className="location-kicker">Click to view</span>
              <strong>CORPORATE OFFICE LOCATION</strong>
            </button>
            <button type="button" aria-label="View factory location">
              <GoogleMapsIcon />
              <span className="google-map-label">Google Maps</span>
              <span className="location-kicker">Click to view</span>
              <strong>FACTORY LOCATION</strong>
            </button>
          </aside>
        </section>

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

      {activeMap === 'corporate' && (
        <div className="map-floating-layer" role="presentation" onClick={closeMap}>
          <section
            className="map-floating-tab"
            role="dialog"
            aria-modal="true"
            aria-label="Corporate office location map"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="map-floating-header">
              <div>
                <span>Google Maps</span>
                <h2>Corporate Office Location</h2>
              </div>
              <div className="map-floating-actions">
                <a href={corporateOfficeMapsUrl} target="_blank" rel="noreferrer" aria-label="Open corporate office location in Google Maps">
                  <ExternalLink size={19} strokeWidth={2.4} />
                </a>
                <button type="button" onClick={closeMap} aria-label="Close corporate office map">
                  <X size={21} strokeWidth={2.4} />
                </button>
              </div>
            </header>
            <iframe
              className="map-floating-frame"
              title="SRMB House Newtown Corporate Office location"
              src={corporateOfficeEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </section>
        </div>
      )}
    </main>
  );
}
