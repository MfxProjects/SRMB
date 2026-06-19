import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import './styles/pages/HomePage.css';
import { Play } from 'lucide-react';
import { cards, formatHomeDateTime, formatDigitalTime, corporateVideo, themeIds, defaultTheme, sectionDetails } from './data/appData.jsx';
import { CalendarModal, ClockModal, FeatureCard, ThemeMark, WelcomeModal, pageFromPath, pathForPage } from './components/shared.jsx';

// Each internal page is downloaded only when it is opened, keeping startup light.
const pageImporters = {
  about: () => import('./pages/AboutPage.jsx'),
  'board-directors': () => import('./pages/BoardDirectorsPage.jsx'),
  'mission-vision': () => import('./pages/MissionVisionPage.jsx'),
  products: () => import('./pages/ProductsPage.jsx'),
  infrastructure: () => import('./pages/InfrastructurePage.jsx'),
  'media-corner': () => import('./pages/MediaCornerPage.jsx'),
  'customer-testimony': () => import('./pages/CustomerTestimonyPage.jsx'),
  projects: () => import('./pages/ProjectsPage.jsx'),
  certificate: () => import('./pages/CertificatePage.jsx'),
  awards: () => import('./pages/CertificatePage.jsx'),
  gallery: () => import('./pages/GalleryPage.jsx'),
  contact: () => import('./pages/ContactPage.jsx'),
  csr: () => import('./pages/CsrPage.jsx'),
  sustainability: () => import('./pages/SustainabilityPage.jsx'),
  'game-corner': () => import('./pages/GameCornerPage.jsx'),
  simple: () => import('./pages/SimpleSectionPage.jsx'),
};

const AboutPage = lazy(pageImporters.about);
const BoardDirectorsPage = lazy(pageImporters['board-directors']);
const MissionVisionPage = lazy(pageImporters['mission-vision']);
const ProductsPage = lazy(pageImporters.products);
const InfrastructurePage = lazy(pageImporters.infrastructure);
const MediaCornerPage = lazy(pageImporters['media-corner']);
const CustomerTestimonyPage = lazy(pageImporters['customer-testimony']);
const ProjectsPage = lazy(pageImporters.projects);
const CertificatePage = lazy(pageImporters.certificate);
const GalleryPage = lazy(pageImporters.gallery);
const ContactPage = lazy(pageImporters.contact);
const CsrPage = lazy(pageImporters.csr);
const SustainabilityPage = lazy(pageImporters.sustainability);
const GameCornerPage = lazy(pageImporters['game-corner']);
const SimpleSectionPage = lazy(pageImporters.simple);

function preloadPage(page) {
  const importer = pageImporters[page] || (sectionDetails[page] ? pageImporters.simple : null);
  importer?.();
}

function PageRoute({ component: Component, ...props }) {
  return (
    <Suspense fallback={<main className="screen page-loading-screen" aria-label="Loading page" />}>
      <Component {...props} />
    </Suspense>
  );
}

// Controls top-level navigation and renders the home screen or the selected page.
export default function App() {
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('srmb-theme');
    return themeIds.has(savedTheme) ? savedTheme : defaultTheme;
  });
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isClockOpen, setIsClockOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCorporateVideoOpen, setIsCorporateVideoOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [homeIndex, setHomeIndex] = useState(0);
  const [homeDragStart, setHomeDragStart] = useState(null);
  const [homeDragDelta, setHomeDragDelta] = useState(0);
  const ignoreHomeClickRef = useRef(false);

  // Persist the selected visual theme so it remains active after a restart.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('srmb-theme', theme);
  }, [theme]);

  // Keep the home clock current without forcing the individual pages to manage time.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isClockOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsClockOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClockOpen]);

  useEffect(() => {
    if (!isCalendarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  useEffect(() => {
    if (!isCorporateVideoOpen && !isWelcomeOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCorporateVideoOpen(false);
        setIsWelcomeOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCorporateVideoOpen, isWelcomeOpen]);

  function openPage(nextPage) {
    // The app uses browser history instead of a routing dependency.
    preloadPage(nextPage);
    setPage(nextPage);
    window.history.pushState(null, '', pathForPage(nextPage));
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function moveHomeCards(offset) {
    const maxIndex = Math.max(cards.length - 5, 0);
    setHomeIndex((current) => Math.min(Math.max(current + offset, 0), maxIndex));
  }

  function getHomeCardStep(container) {
    const track = container.querySelector('.cards-track');
    const card = container.querySelector('.feature-card');

    if (!track || !card) {
      return 1;
    }

    const trackStyles = window.getComputedStyle(track);
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function beginHomeDrag(event) {
    setHomeDragStart(event.clientX);
    setHomeDragDelta(0);
    ignoreHomeClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateHomeDrag(event) {
    if (homeDragStart === null) {
      return;
    }

    const nextDelta = event.clientX - homeDragStart;
    setHomeDragDelta(nextDelta);
  }

  function endHomeDrag(event) {
    // A long horizontal gesture scrolls cards; a short gesture behaves as a click.
    if (homeDragStart === null) {
      return;
    }

    const dragDistance = Math.abs(homeDragDelta);

    if (dragDistance > 52) {
      const cardStep = getHomeCardStep(event.currentTarget);
      const slideCount = Math.max(1, Math.round(dragDistance / cardStep));

      ignoreHomeClickRef.current = true;
      moveHomeCards(homeDragDelta < 0 ? slideCount : -slideCount);
      window.setTimeout(() => {
        ignoreHomeClickRef.current = false;
      }, 120);
    } else {
      const cardButton = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest('.feature-card');
      const targetPage = cardButton?.dataset.page;

      if (targetPage) {
        ignoreHomeClickRef.current = true;
        openPage(targetPage);
        window.setTimeout(() => {
          ignoreHomeClickRef.current = false;
        }, 120);
      }
    }

    setHomeDragStart(null);
    setHomeDragDelta(0);
  }

  if (page === 'about') {
    return <PageRoute component={AboutPage} onNavigate={openPage} />;
  }

  if (page === 'board-directors') {
    return <PageRoute component={BoardDirectorsPage} onNavigate={openPage} />;
  }

  if (page === 'mission-vision') {
    return <PageRoute component={MissionVisionPage} onNavigate={openPage} />;
  }

  if (page === 'products') {
    return <PageRoute component={ProductsPage} onNavigate={openPage} />;
  }

  if (page === 'infrastructure') {
    return <PageRoute component={InfrastructurePage} onNavigate={openPage} />;
  }

  if (page === 'media-corner') {
    return <PageRoute component={MediaCornerPage} onNavigate={openPage} />;
  }

  if (page === 'customer-testimony') {
    return <PageRoute component={CustomerTestimonyPage} onNavigate={openPage} />;
  }

  if (page === 'projects') {
    return <PageRoute component={ProjectsPage} onNavigate={openPage} />;
  }

  if (page === 'certificate') {
    return <PageRoute component={CertificatePage} activePage="certificate" onNavigate={openPage} />;
  }

  if (page === 'awards') {
    return <PageRoute component={CertificatePage} activePage="awards" onNavigate={openPage} />;
  }

  if (page === 'gallery') {
    return <PageRoute component={GalleryPage} onNavigate={openPage} />;
  }

  if (page === 'contact') {
    return <PageRoute component={ContactPage} onNavigate={openPage} />;
  }

  if (page === 'csr') {
    return <PageRoute component={CsrPage} onNavigate={openPage} />;
  }

  if (page === 'sustainability') {
    return <PageRoute component={SustainabilityPage} onNavigate={openPage} />;
  }

  if (page === 'game-corner') {
    return <PageRoute component={GameCornerPage} onNavigate={openPage} />;
  }

  if (sectionDetails[page]) {
    return <PageRoute component={SimpleSectionPage} page={page} details={sectionDetails[page]} onNavigate={openPage} />;
  }

  return (
    <main className="screen">
      <section className="front-panel">
        <header className="top-bar">
          <button className="date-text" type="button" onClick={() => setIsCalendarOpen(true)} aria-label="Open calendar">
            <span className="date-text-day">{formatHomeDateTime(currentTime)}</span>
          </button>
          <button className="brand-logo-button" type="button" onClick={() => setIsWelcomeOpen(true)} aria-label="Open SRMB welcome page">
            <img className="brand-logo" src="/assets/applogo/download.jpg" alt="SRMB" />
          </button>
          <div className="home-clock-cluster">
            <button className="home-digital-clock" type="button" onClick={() => setIsClockOpen(true)} aria-label="Open digital clock">
              <span className="home-digital-time">{formatDigitalTime(currentTime).toLowerCase().replace(/^0/, '')}</span>
              <span className="home-digital-location">New Town, Kolkata</span>
            </button>
            <ThemeMark activeTheme={theme} onThemeChange={setTheme} />
          </div>
        </header>

        <section
          className={`cards-row ${homeDragStart !== null ? 'dragging' : ''}`}
          aria-label="SRMB sections"
          onPointerDown={beginHomeDrag}
          onPointerMove={updateHomeDrag}
          onPointerUp={endHomeDrag}
          onPointerCancel={endHomeDrag}
          style={{ '--home-index': homeIndex, '--home-drag-x': `${homeDragDelta}px` }}
        >
          <div className="cards-track">
          {cards.map((card) => (
            <FeatureCard
              key={card.label}
              card={card}
              onPrefetch={() => preloadPage(card.page)}
              onOpen={() => {
                if (ignoreHomeClickRef.current) {
                  return;
                }
                openPage(card.page);
              }}
            />
          ))}
          </div>
        </section>

        <footer className="bottom-bar">
          <button className="video-link" type="button" onClick={() => setIsCorporateVideoOpen(true)}>
            <span className="play-ring">
              <Play fill="currentColor" strokeWidth={1.8} />
            </span>
            <span>CORPORATE<br />VIDEO</span>
          </button>

          <button className="ads-button" type="button">
            <span className="ads-play-ring" aria-hidden="true">
              <Play fill="currentColor" strokeWidth={1.8} />
            </span>
            <span>Click here to watch SRMB<br />ADS</span>
          </button>
        </footer>
      </section>

      {isClockOpen && <ClockModal currentTime={currentTime} onClose={() => setIsClockOpen(false)} />}
      {isCalendarOpen && <CalendarModal currentTime={currentTime} onClose={() => setIsCalendarOpen(false)} />}
      {isWelcomeOpen && <WelcomeModal onClose={() => setIsWelcomeOpen(false)} />}

      {isCorporateVideoOpen && (
        <div
          className="corporate-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Corporate video player"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsCorporateVideoOpen(false);
            }
          }}
        >
          <div className="corporate-modal">
            <button
              className="corporate-close"
              type="button"
              onClick={() => setIsCorporateVideoOpen(false)}
              aria-label="Close corporate video"
            >
              ×
            </button>

            <video
              className="corporate-video"
              src={encodeURI(corporateVideo)}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </main>
  );
}
