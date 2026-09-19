import React, { lazy, startTransition, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import './styles/pages/HomePage.css';
import { ArrowLeft, Clapperboard, Grid3X3, Menu, MousePointerClick, Play, StickyNote, X } from 'lucide-react';
import { cards, formatDigitalTime, formatLongDate, corporateVideo, newTvcVideo, brandAmbassadorImage, themeIds, defaultTheme, sectionDetails, galleryVideos, mediaCornerSections } from './data/appData.jsx';
import { FeatureCard, WelcomeModal, pageFromPath, pathForPage } from './components/shared.jsx';
import LockScreenSettings from './components/LockScreenSettings.jsx';

const LOCK_SETTINGS_KEY = 'srmb-lock-screen-settings';
const LOCK_MEDIA_DB = 'srmb-display-settings';
const LOCK_MEDIA_STORE = 'media';
const DEFAULT_LOCK_SETTINGS = {
  enabled: true,
  mediaType: 'image',
  mediaSource: 'brand',
  idleSeconds: 60,
  showClock: true,
  showTapPrompt: true,
  clockStyle: 'glass',
};

function loadLockSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(LOCK_SETTINGS_KEY) || '{}');
    return {
      ...DEFAULT_LOCK_SETTINGS,
      ...savedSettings,
      enabled: savedSettings.enabled !== false,
      idleSeconds: Math.min(3600, Math.max(10, Number(savedSettings.idleSeconds) || 60)),
    };
  } catch {
    return DEFAULT_LOCK_SETTINGS;
  }
}

function openLockMediaDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(LOCK_MEDIA_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(LOCK_MEDIA_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readCustomLockMedia() {
  const database = await openLockMediaDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(LOCK_MEDIA_STORE).objectStore(LOCK_MEDIA_STORE).get('custom');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function saveCustomLockMedia(file) {
  const database = await openLockMediaDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCK_MEDIA_STORE, 'readwrite');
    transaction.objectStore(LOCK_MEDIA_STORE).put(file, 'custom');
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

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
  'group-companies': () => import('./pages/GroupCompaniesPage.jsx'),
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
const GroupCompaniesPage = lazy(pageImporters['group-companies']);
const SimpleSectionPage = lazy(pageImporters.simple);
const NotesPage = lazy(() => import('./pages/NotesPage.jsx'));

function preloadPage(page) {
  const importer = pageImporters[page] || (sectionDetails[page] ? pageImporters.simple : null);
  importer?.();
}

function normalizeMediaUrl(value) {
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return encodeURI(value);
  }
}

function restartVideoFromBeginning(video) {
  video.currentTime = 0;
  video.play().catch(() => {});
}

function PageRoute({ component: Component, ...props }) {
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
}

function IdleLockScreen({ currentTime, settings, customMediaUrl, onUnlock }) {
  const mediaUrl = settings.mediaSource === 'custom' && customMediaUrl
    ? customMediaUrl
    : settings.mediaSource === 'new-tvc' && settings.mediaType === 'video'
      ? newTvcVideo
    : settings.mediaType === 'video'
      ? corporateVideo
      : brandAmbassadorImage;

  return (
    <div
      className={`idle-lock-screen${settings.showClock ? '' : ' is-clock-hidden'}`}
      role="dialog"
      aria-modal="true"
      aria-label="SRMB lock screen"
      onPointerDown={onUnlock}
      onKeyDown={onUnlock}
      tabIndex={0}
    >
      {settings.mediaType === 'video' ? (
        <video
          className="idle-lock-image"
          src={normalizeMediaUrl(mediaUrl)}
          autoPlay
          loop
          muted
          playsInline
          onEnded={(event) => restartVideoFromBeginning(event.currentTarget)}
        />
      ) : (
        <img className="idle-lock-image" src={mediaUrl} alt="SRMB lock screen" />
      )}
      {settings.showClock && <div className="idle-lock-shade" aria-hidden="true" />}
      {settings.showClock && (
        <div className={`idle-lock-time-card idle-clock-${settings.clockStyle}`}>
          {settings.clockStyle === 'glass' && <img src="/assets/applogo/download.png" alt="SRMB" />}
          <div>
            <strong>{formatDigitalTime(currentTime).toLowerCase().replace(/^0/, '')}</strong>
            <span>{formatLongDate(currentTime)}</span>
          </div>
        </div>
      )}
      {settings.showTapPrompt && (
        <div className="idle-lock-tap-prompt" aria-hidden="true">
          <MousePointerClick />
          <span>Tap to start</span>
        </div>
      )}
    </div>
  );
}

// Controls top-level navigation and renders the home screen or the selected page.
export default function App() {
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));
  const [theme] = useState(() => {
    const savedTheme = localStorage.getItem('srmb-theme');
    if (savedTheme === 'mono' && localStorage.getItem('srmb-theme-before-light')) {
      return 'golden-light';
    }
    return themeIds.has(savedTheme) ? savedTheme : defaultTheme;
  });
  const [isCorporateVideoOpen, setIsCorporateVideoOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isHomeMediaOpen, setIsHomeMediaOpen] = useState(false);
  const [homeVideo, setHomeVideo] = useState(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLockScreenOpen, setIsLockScreenOpen] = useState(false);
  const [lockScreenTime, setLockScreenTime] = useState(() => new Date());
  const [lockSettings, setLockSettings] = useState(loadLockSettings);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [isLogoHolding, setIsLogoHolding] = useState(false);
  const [homeIndex, setHomeIndex] = useState(0);
  const [homeDragStart, setHomeDragStart] = useState(null);
  const [homeDragDelta, setHomeDragDelta] = useState(0);
  const ignoreHomeClickRef = useRef(false);
  const idleTimerRef = useRef(null);
  const logoHoldTimerRef = useRef(null);
  const logoHoldTriggeredRef = useRef(false);
  const customMediaUrlRef = useRef('');
  const homePageCards = useMemo(() => cards.filter((card) => card.page !== 'home'), []);
  const homeMediaItems = useMemo(() => {
    const mediaItems = mediaCornerSections.flatMap((section) => section.videos.map((video) => ({
      ...video,
      group: section.title,
    })));
    const galleryItems = galleryVideos.map((video) => ({
      src: video.src,
      title: video.title,
      meta: 'Media Gallery',
      group: 'Gallery',
      poster: video.poster || '',
    }));
    return [...mediaItems, ...galleryItems];
  }, []);

  // Persist the selected visual theme so it remains active after a restart.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('srmb-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LOCK_SETTINGS_KEY, JSON.stringify(lockSettings));
  }, [lockSettings]);

  useEffect(() => {
    let isMounted = true;

    readCustomLockMedia()
      .then((file) => {
        if (!isMounted || !file) {
          return;
        }

        const nextUrl = URL.createObjectURL(file);
        customMediaUrlRef.current = nextUrl;
        setCustomMediaUrl(nextUrl);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (customMediaUrlRef.current) {
        URL.revokeObjectURL(customMediaUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLockScreenOpen) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setLockScreenTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLockScreenOpen]);

  useEffect(() => {
    const activityEvents = ['pointerdown', 'touchstart', 'keydown', 'wheel'];

    function clearIdleTimer() {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    }

    function startIdleTimer() {
      clearIdleTimer();

      if (!lockSettings.enabled || isCorporateVideoOpen || isWelcomeOpen || isSettingsOpen || isAppDrawerOpen || homeVideo || page === 'notes') {
        return;
      }

      idleTimerRef.current = window.setTimeout(() => {
        setLockScreenTime(new Date());
        setIsLockScreenOpen(true);
      }, lockSettings.idleSeconds * 1000);
    }

    function handleActivity() {
      setIsLockScreenOpen(false);
      startIdleTimer();
    }

    if (!lockSettings.enabled) {
      setIsLockScreenOpen(false);
      return clearIdleTimer;
    }

    startIdleTimer();
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { capture: true, passive: true });
    });

    return () => {
      clearIdleTimer();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity, { capture: true });
      });
    };
  }, [isCorporateVideoOpen, isWelcomeOpen, isSettingsOpen, isAppDrawerOpen, homeVideo, page, lockSettings.enabled, lockSettings.idleSeconds]);

  useEffect(() => {
    if (!isCorporateVideoOpen && !isWelcomeOpen && !isSettingsOpen && !isAppDrawerOpen && !isLockScreenOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCorporateVideoOpen(false);
        setIsWelcomeOpen(false);
        setIsSettingsOpen(false);
        setIsAppDrawerOpen(false);
        setIsLockScreenOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCorporateVideoOpen, isWelcomeOpen, isSettingsOpen, isAppDrawerOpen, isLockScreenOpen]);

  function updateLockSettings(changes) {
    if (changes.previewRequested) {
      setIsSettingsOpen(false);
      setLockScreenTime(new Date());
      setIsLockScreenOpen(true);
      return;
    }

    if (changes.enabled === false) {
      setIsLockScreenOpen(false);
    }

    setLockSettings((current) => ({ ...current, ...changes }));
  }

  async function chooseCustomMedia(file) {
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    await saveCustomLockMedia(file);

    if (customMediaUrlRef.current) {
      URL.revokeObjectURL(customMediaUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    customMediaUrlRef.current = nextUrl;
    setCustomMediaUrl(nextUrl);
    updateLockSettings({ mediaType, mediaSource: 'custom' });
  }

  function cancelLogoHold() {
    if (logoHoldTimerRef.current) {
      window.clearTimeout(logoHoldTimerRef.current);
      logoHoldTimerRef.current = null;
    }
    setIsLogoHolding(false);
  }

  function beginLogoHold(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    cancelLogoHold();
    logoHoldTriggeredRef.current = false;
    setIsLogoHolding(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    logoHoldTimerRef.current = window.setTimeout(() => {
      logoHoldTriggeredRef.current = true;
      setIsLogoHolding(false);
      setIsWelcomeOpen(false);
      setIsSettingsOpen(true);
    }, 5000);
  }

  function handleLogoClick() {
    if (logoHoldTriggeredRef.current) {
      logoHoldTriggeredRef.current = false;
      return;
    }
    setIsWelcomeOpen(true);
  }

  function openPage(nextPage) {
    // The app uses browser history instead of a routing dependency.
    preloadPage(nextPage);
    // Keep the current page visible while the lazy-loaded next page becomes ready.
    startTransition(() => {
      setPage(nextPage);
    });
    setIsAppDrawerOpen(false);
    setIsQuickMenuOpen(false);
    setIsHomeMediaOpen(false);
    setHomeVideo(null);
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

  function renderWithLockScreen(content) {
    return (
      <>
        {content}
        {isLockScreenOpen && (
          <IdleLockScreen
            currentTime={lockScreenTime}
            settings={lockSettings}
            customMediaUrl={customMediaUrl}
            onUnlock={() => setIsLockScreenOpen(false)}
          />
        )}
      </>
    );
  }

  if (page === 'about') {
    return renderWithLockScreen(<PageRoute component={AboutPage} onNavigate={openPage} />);
  }

  if (page === 'board-directors') {
    return renderWithLockScreen(<PageRoute component={BoardDirectorsPage} onNavigate={openPage} />);
  }

  if (page === 'mission-vision') {
    return renderWithLockScreen(<PageRoute component={MissionVisionPage} onNavigate={openPage} />);
  }

  if (page === 'products') {
    return renderWithLockScreen(<PageRoute component={ProductsPage} onNavigate={openPage} />);
  }

  if (page === 'infrastructure') {
    return renderWithLockScreen(<PageRoute component={InfrastructurePage} onNavigate={openPage} />);
  }

  if (page === 'media-corner') {
    return renderWithLockScreen(<PageRoute component={MediaCornerPage} onNavigate={openPage} />);
  }

  if (page === 'customer-testimony') {
    return renderWithLockScreen(<PageRoute component={CustomerTestimonyPage} onNavigate={openPage} />);
  }

  if (page === 'projects') {
    return renderWithLockScreen(<PageRoute component={ProjectsPage} onNavigate={openPage} />);
  }

  if (page === 'certificate') {
    return renderWithLockScreen(<PageRoute component={CertificatePage} activePage="certificate" onNavigate={openPage} />);
  }

  if (page === 'awards') {
    return renderWithLockScreen(<PageRoute component={CertificatePage} activePage="awards" onNavigate={openPage} />);
  }

  if (page === 'gallery') {
    return renderWithLockScreen(<PageRoute component={GalleryPage} onNavigate={openPage} />);
  }

  if (page === 'contact') {
    return renderWithLockScreen(<PageRoute component={ContactPage} onNavigate={openPage} />);
  }

  if (page === 'csr') {
    return renderWithLockScreen(<PageRoute component={CsrPage} onNavigate={openPage} />);
  }

  if (page === 'sustainability') {
    return renderWithLockScreen(<PageRoute component={SustainabilityPage} onNavigate={openPage} />);
  }

  if (page === 'game-corner') {
    return renderWithLockScreen(<PageRoute component={GameCornerPage} onNavigate={openPage} />);
  }

  if (page === 'group-companies') {
    return renderWithLockScreen(<PageRoute component={GroupCompaniesPage} onNavigate={openPage} />);
  }

  if (sectionDetails[page]) {
    return renderWithLockScreen(<PageRoute component={SimpleSectionPage} page={page} details={sectionDetails[page]} onNavigate={openPage} />);
  }

  if (page === 'notes') {
    return renderWithLockScreen(<PageRoute component={NotesPage} onBack={() => openPage('home')} />);
  }

  return renderWithLockScreen(
    <main className="screen">
      <section className="front-panel">
        <div className="home-main-layout">
          <section className={`home-brand-hero${homeVideo ? ' is-playing-media' : ''}`} aria-label={homeVideo ? `Playing ${homeVideo.title}` : 'Welcome image featuring SRMB brand ambassadors'}>
            {homeVideo ? (
              <video key={homeVideo.src} src={normalizeMediaUrl(homeVideo.src)} controls autoPlay playsInline />
            ) : (
              <img src={brandAmbassadorImage} alt="SRMB brand ambassadors welcome display" decoding="async" />
            )}
          </section>

          <section className="cards-row" aria-label="SRMB section buttons">
            <div className="cards-track">
              {homePageCards.map((card) => (
                <FeatureCard
                  key={card.label}
                  card={card}
                  onPrefetch={() => preloadPage(card.page)}
                  onOpen={() => openPage(card.page)}
                />
              ))}
            </div>
          </section>
        </div>

        <footer className={`bottom-bar launcher-bar${isQuickMenuOpen ? ' is-menu-open' : ''}${isHomeMediaOpen ? ' is-media-open' : ''}`}>
          <button
            className={`brand-logo-button${isLogoHolding ? ' is-holding' : ''}`}
            type="button"
            onClick={handleLogoClick}
            onPointerDown={beginLogoHold}
            onPointerUp={cancelLogoHold}
            onPointerCancel={cancelLogoHold}
            onContextMenu={(event) => event.preventDefault()}
            aria-label="Open SRMB welcome page. Hold for five seconds to open settings."
          >
            <img className="brand-logo" src="/assets/applogo/download.png" alt="SRMB" />
            <span className="logo-hold-indicator" aria-hidden="true" />
          </button>

          {isHomeMediaOpen ? (
            <div className="home-media-strip" aria-label="Media and gallery videos">
              <button
                className="home-media-strip-back"
                type="button"
                onClick={() => { setIsHomeMediaOpen(false); setHomeVideo(null); }}
                aria-label="Close media list and restore brand ambassador image"
              >
                <ArrowLeft /><span>Back</span>
              </button>
              <div className="home-media-scroller">
                {homeMediaItems.map((video) => (
                  <button
                    className={`home-media-thumb${homeVideo?.src === video.src ? ' is-active' : ''}`}
                    type="button"
                    key={`${video.group}-${video.src}`}
                    onClick={() => setHomeVideo(video)}
                    aria-label={`Play ${video.title}`}
                  >
                    {video.poster ? (
                      <img src={video.poster} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <video
                        src={normalizeMediaUrl(video.src)}
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        onLoadedMetadata={(event) => {
                          event.currentTarget.currentTime = Math.min(1, event.currentTarget.duration || 1);
                        }}
                      />
                    )}
                    <Play className="home-media-thumb-play" fill="currentColor" />
                    <span><small>{video.group}</small><strong>{video.title}</strong></span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <div className="home-launcher" aria-label="SRMB quick menu">
            <button
              className={`launcher-menu-button${isQuickMenuOpen ? ' is-active' : ''}`}
              type="button"
              onClick={() => setIsQuickMenuOpen((current) => !current)}
              aria-expanded={isQuickMenuOpen}
              aria-label={isQuickMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isQuickMenuOpen ? <X /> : <Menu />}
              <span>Menu</span>
            </button>
            <div className="launcher-actions" aria-hidden={!isQuickMenuOpen}>
              <button type="button" onClick={() => openPage('notes')} tabIndex={isQuickMenuOpen ? 0 : -1}>
                <StickyNote /><span>Keep notes</span>
              </button>
              <button type="button" onClick={() => { setIsHomeMediaOpen(true); setIsQuickMenuOpen(false); }} tabIndex={isQuickMenuOpen ? 0 : -1}>
                <Clapperboard /><span>Gallery</span>
              </button>
              <button type="button" onClick={() => { setIsAppDrawerOpen(true); setIsQuickMenuOpen(false); }} tabIndex={isQuickMenuOpen ? 0 : -1}>
                <Grid3X3 /><span>All pages</span>
              </button>
            </div>
          </div>
          )}
        </footer>
      </section>

      {isWelcomeOpen && <WelcomeModal onClose={() => setIsWelcomeOpen(false)} />}

      {isSettingsOpen && (
        <LockScreenSettings
          settings={lockSettings}
          customMediaUrl={customMediaUrl}
          onChange={updateLockSettings}
          onChooseCustomMedia={chooseCustomMedia}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

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

      {isAppDrawerOpen && (
        <div
          className="app-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="All SRMB pages"
          onClick={(event) => {
            if (!event.target.closest('.app-drawer-tile, .app-drawer-header')) {
              setIsAppDrawerOpen(false);
            }
          }}
        >
          <div className="app-drawer-header">
            <div>
              <span>SRMB</span>
              <h2>All pages</h2>
              <p>Choose a section to open</p>
            </div>
            <button type="button" onClick={() => setIsAppDrawerOpen(false)} aria-label="Close app drawer"><X /></button>
          </div>
          <div className="app-drawer-grid">
            <button className="app-drawer-tile notes-tile" type="button" onClick={() => openPage('notes')}>
              <span className="app-drawer-icon"><StickyNote /></span>
              <strong>Keep Notes</strong>
              <small>Write and draw</small>
            </button>
            {cards.map((item) => (
              <button className="app-drawer-tile" type="button" key={item.page} onClick={() => openPage(item.page)} onPointerEnter={() => preloadPage(item.page)}>
                <span className="app-drawer-icon"><img src={item.icon} alt="" /></span>
                <strong>{item.label}</strong>
                <small>Open page</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
