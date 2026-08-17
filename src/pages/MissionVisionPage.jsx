import React from 'react';
import '../styles/pages/MissionVisionPage.css';
import '../styles/kiosk-overrides.css';
import { ArrowLeft, Factory, Sun } from 'lucide-react';
import { PrimaryNav } from '../components/shared.jsx';

// Communicates SRMB's mission and vision.
export default function MissionVisionPage({ onNavigate }) {
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
          </div>

          <div className="mission-vision-grid">
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
          </div>
        </section>

        <div className="mission-vision-back-row">
          <button type="button" onClick={() => onNavigate('about')} aria-label="Back to About Us" title="Back to About Us">
            <ArrowLeft aria-hidden="true" />
          </button>
        </div>

        <PrimaryNav activePage="about" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
