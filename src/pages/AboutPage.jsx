import React, { useEffect, useRef } from 'react';
import '../styles/pages/AboutPage.css';
import '../styles/kiosk-overrides.css';
import { corporateVideo, navItems } from '../data/appData.jsx';

// Company overview with the SRMB corporate film and company profile.
export default function AboutPage({ onNavigate }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    video?.play().catch(() => {
      // Keep native controls available if the browser blocks audible autoplay.
    });

    return () => {
      video?.pause();
    };
  }, []);

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
          <div className="photo-card about-video-card">
            <video
              ref={videoRef}
              className="about-corporate-video"
              src={encodeURI(corporateVideo)}
              controls
              autoPlay
              playsInline
              preload="metadata"
              aria-label="SRMB corporate video"
            />
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
      </section>
    </main>
  );
}
