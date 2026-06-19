import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/MissionVisionPage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Communicates SRMB's mission, vision, and core operating principles.
export default function MissionVisionPage({ onNavigate }) {
  const pillars = [
    { label: 'Precision', text: 'Strict quality control at every stage.', icon: Check },
    { label: 'Innovation', text: 'Advancing technology for better steel.', icon: Zap },
    { label: 'Quality', text: 'Products built to exceed expectations.', icon: ShieldCheck },
    { label: 'Infrastructure', text: 'Supporting strong global growth.', icon: Landmark },
  ];

  return (
    <main className="screen about-screen mission-vision-screen title-simple-page">
      <section className="about-panel mission-vision-panel">
        <header className="about-header mission-vision-header">
          <div className="about-title-bar">
            <h1>MISSION &amp; VISION</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="mission-vision-stage" aria-label="Vision and mission of SRMB Srijan Private Limited">
          <div className="mission-vision-intro">
            <p>Vision and Mission of M/s. SRMB Srijan Private Limited</p>
            <button type="button" onClick={() => onNavigate('about')} aria-label="Back to About Us" title="Back to About Us">
              <ArrowLeft aria-hidden="true" />
            </button>
          </div>

          <div className="mission-vision-grid">
            <article className="mission-vision-card vision-card">
              <div className="mission-vision-icon">
                <Sun aria-hidden="true" />
              </div>
              <div>
                <span>Vision</span>
                <h2>Excellence That Sets Benchmarks</h2>
                <p>
                  Driven by a relentless pursuit of excellence, we aim to exceed industry standards and deliver
                  products that surpass the highest quality levels. Our commitment to precision, innovation, and
                  strict quality control ensures we lead the industry, set benchmarks, and provide premium products
                  that stand the test of time.
                </p>
              </div>
            </article>

            <article className="mission-vision-card mission-card">
              <div className="mission-vision-icon">
                <Factory aria-hidden="true" />
              </div>
              <div>
                <span>Mission</span>
                <h2>Global Choice For Stronger Steel</h2>
                <p>
                  Our Mission is to be the top global choice for steel, recognized for quality, innovation &amp;
                  customer satisfaction. We aim to lead in manufacturing steel &amp; TMT bars, advancing technology
                  &amp; sustainability, setting industry standards &amp; delivering products that exceed expectations
                  &amp; support global infrastructure growth.
                </p>
              </div>
            </article>
          </div>

          <div className="mission-flow" aria-label="Mission and vision pillars">
            {pillars.map((pillar, index) => {
              const PillarIcon = pillar.icon;
              return (
                <article className="mission-flow-card" key={pillar.label}>
                  <span className="mission-flow-step">{String(index + 1).padStart(2, '0')}</span>
                  <div className="mission-flow-icon">
                    <PillarIcon aria-hidden="true" />
                  </div>
                  <h3>{pillar.label}</h3>
                  <p>{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <PrimaryNav activePage="about" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
