import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/SimpleSectionPage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Reusable informational placeholder for sections that do not need custom interactions yet.
export default function SimpleSectionPage({ page, details, onNavigate }) {
  const section = sections.find((item) => item.page === page);

  return (
    <main className="screen about-screen simple-section-screen title-simple-page">
      <section className="about-panel simple-section-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>{details.title}</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="simple-section-content" aria-label={details.title}>
          <div className="simple-section-icon">
            <img src={section.icon} alt="" />
          </div>
          <p>{details.eyebrow}</p>
        </section>

        <PrimaryNav activePage={page} onNavigate={onNavigate} />
      </section>
    </main>
  );
}
