import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';

// Theme selector used on the home screen.
export function ThemeMark({ activeTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-picker">
      <button
        className="theme-mark"
        aria-label="Choose theme"
        aria-expanded={isOpen}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Sun aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="theme-menu" role="menu" aria-label="Theme options">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={theme.id === activeTheme ? 'active' : ''}
              type="button"
              role="menuitemradio"
              aria-checked={theme.id === activeTheme}
              onClick={() => {
                onThemeChange(theme.id);
                setIsOpen(false);
              }}
            >
              <span className="theme-swatches" aria-hidden="true">
                {theme.colors.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
                ))}
              </span>
              <span>{theme.label}</span>
              {theme.id === activeTheme && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable home card representing one navigable section.
export function FeatureCard({ card, onOpen, onPrefetch }) {
  return (
    <button
      className={`feature-card ${card.image ? 'image-card' : 'icon-card'}`}
      data-page={card.page}
      onClick={onOpen}
      onPointerEnter={onPrefetch}
      onFocus={onPrefetch}
      type="button"
      aria-label={card.label}
    >
      {card.image ? (
        <>
          <img
            src={card.image}
            alt=""
            className="feature-image"
            draggable="false"
            decoding="async"
          />
        </>
      ) : (
        <span className="feature-icon-card">
          <img src={card.icon} alt="" draggable="false" />
          <span>{card.label}</span>
        </span>
      )}
    </button>
  );
}

// Full-screen clock popup opened from the home header.
export function ClockModal({ currentTime, onClose }) {
  return (
    <div
      className="clock-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="SRMB digital clock"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="clock-modal">
        <button className="clock-close" type="button" onClick={onClose} aria-label="Close clock">
          <X aria-hidden="true" />
        </button>

        <div className="clock-content">
          <p className="clock-title">Current Time</p>

          <div className="digital-clock" aria-live="polite">
            <span>{formatDigitalTime(currentTime).toLowerCase().replace(/^0/, '')}</span>
          </div>

          <p className="clock-location">New Town, Kolkata</p>
          <p className="digital-date">{formatLongDate(currentTime)}</p>
        </div>
      </section>
    </div>
  );
}

// Calendar popup that combines generated month days with configured events.
export function CalendarModal({ currentTime, onClose }) {
  const todayKey = toCalendarKey(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
  const { days, monthEvents } = getCalendarMonthData(currentTime);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      className="clock-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Current month calendar"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="clock-modal calendar-modal">
        <button className="clock-close" type="button" onClick={onClose} aria-label="Close calendar">
          <X aria-hidden="true" />
        </button>

        <div className="calendar-content">
          <div className="calendar-layout">
            <div className="calendar-grid" aria-label={`${formatMonthTitle(currentTime)} calendar`}>
              {weekdays.map((weekday) => (
                <span className="calendar-weekday" key={weekday}>{weekday}</span>
              ))}

              {days.map((day, index) => (
                day ? (
                  <div
                    className={`calendar-day ${day.dateKey === todayKey ? 'today' : ''} ${day.events.some((event) => event.type === 'holiday') ? 'holiday' : ''} ${day.events.length ? 'has-event' : ''}`}
                    key={day.dateKey}
                  >
                    <span className="calendar-day-number">{day.day}</span>
                    <div className="calendar-day-events">
                      {day.events.slice(0, 2).map((event) => (
                        <span className={`calendar-chip ${event.type}`} key={`${event.date}-${event.title}`}>{event.title}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="calendar-day empty" key={`empty-${index}`} aria-hidden="true" />
                )
              ))}
            </div>

            <aside className="calendar-events-panel" aria-label="Current month events">
              <h3>Events, Holidays & Festivals</h3>
              <div className="calendar-legend" aria-hidden="true">
                <span><i className="event" /> Event</span>
                <span><i className="festival" /> Festival</span>
                <span><i className="holiday" /> Holiday</span>
              </div>

              <div className="calendar-event-list">
                {monthEvents.length ? monthEvents.map((event) => {
                  const eventDate = new Date(`${event.date}T00:00:00`);

                  return (
                    <div className={`calendar-event-item ${event.type}`} key={`${event.date}-${event.title}`}>
                      <time dateTime={event.date}>
                        <strong>{String(eventDate.getDate()).padStart(2, '0')}</strong>
                        <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(eventDate)}</span>
                      </time>
                      <div>
                        <h4>{event.title}</h4>
                        <p>{event.note}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="calendar-empty">No listed events for this month.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

// Introductory brand popup opened by clicking the SRMB logo.
export function WelcomeModal({ onClose }) {
  return (
    <div
      className="welcome-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to SRMB"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="welcome-modal">
        <button className="welcome-close" type="button" onClick={onClose} aria-label="Close welcome page">
          <X aria-hidden="true" />
        </button>

        <div className="welcome-copy">
          <img className="welcome-logo" src="/assets/applogo/download.jpg" alt="SRMB" />
          <span className="welcome-kicker">Welcome to SRMB</span>
          <h2>Building stronger futures with trusted steel</h2>
          <p>
            SRMB Srijan Private Limited brings together quality, innovation, and manufacturing excellence to
            support homes, landmarks, and infrastructure across India.
          </p>
          <div className="welcome-stats" aria-label="SRMB highlights">
            <span><strong>70+</strong> Years Legacy</span>
            <span><strong>Fe-700</strong> TMT Strength</span>
            <span><strong>ISO</strong> Certified</span>
          </div>
        </div>

        <div className="welcome-visual">
          <img src={brandAmbassadorImage} alt="SRMB brand ambassador" decoding="async" />
        </div>
      </section>
    </div>
  );
}

// Shared footer navigation used by all internal pages.
export function PrimaryNav({ activePage, onNavigate }) {
  return (
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
  );
}

export function GoogleMapsIcon() {
  return (
    <img
      className="google-map-icon"
      src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png"
      alt=""
      aria-hidden="true"
    />
  );
}

// Convert a browser URL into the internal page key used by App.
export function pageFromPath(pathname) {
  const normalizedPath = pathname.toLowerCase().replace(/^\/+/, '');

  if (!normalizedPath) {
    return 'home';
  }

  if (normalizedPath === 'feedback') {
    return 'contact';
  }

  if (normalizedPath === 'mission-vision' || normalizedPath === 'board-directors') {
    return normalizedPath;
  }

  const match = sections.find((section) => section.page !== 'home' && section.page === normalizedPath);
  return match ? match.page : 'home';
}

// Convert an internal page key back into a clean browser URL.
export function pathForPage(nextPage) {
  if (nextPage === 'home') {
    return '/';
  }

  return `/${nextPage}`;
}
