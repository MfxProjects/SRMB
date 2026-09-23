import React, { useMemo, useRef, useState } from 'react';
import '../styles/pages/CustomerTestimonyPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, Truck, Users, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyCategories, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';
import VideoVolumeControl from '../components/VideoVolumeControl.jsx';

const testimonyCategoryIcons = {
  customer: Users,
  distributor: Truck,
  'elite-club': Trophy,
  'institutional-sales': Landmark,
};

// Browses customer videos by category and plays the selected testimony inline.
export default function CustomerTestimonyPage({ onNavigate }) {
  const [activeCategoryId, setActiveCategoryId] = useState(testimonyCategories[0]?.id);
  const [activeVideo, setActiveVideo] = useState(null);
  const [testimonyPage, setTestimonyPage] = useState(0);
  const [isTestimonyDragging, setIsTestimonyDragging] = useState(false);
  const [testimonyDragDelta, setTestimonyDragDelta] = useState(0);
  const sliderRef = useRef(null);
  const slidebarRef = useRef(null);
  const activeInlineTestimonyVideoRef = useRef(null);
  const testimonyDragStartRef = useRef(null);
  const testimonyDragDeltaRef = useRef(0);
  const testimonyDraggingActiveRef = useRef(false);
  const isTestimonySlidebarDraggingRef = useRef(false);
  const ignoreTestimonyClickRef = useRef(false);

  const activeCategory = useMemo(
    () => testimonyCategories.find((category) => category.id === activeCategoryId) ?? testimonyCategories[0],
    [activeCategoryId],
  );

  const activeCategoryVideos = activeCategory?.videos ?? testimonyVideos;

  const testimonyPages = useMemo(() => {
    const pages = [];

    for (let index = 0; index < activeCategoryVideos.length; index += testimonyVideosPerSlide) {
      pages.push(activeCategoryVideos.slice(index, index + testimonyVideosPerSlide));
    }

    return pages;
  }, [activeCategoryVideos]);

  function selectTestimonyCategory(categoryId) {
    if (categoryId === activeCategoryId) {
      return;
    }

    setActiveCategoryId(categoryId);
    setTestimonyPage(0);
    setActiveVideo(null);
  }

  function clampTestimonyPage(page) {
    return Math.min(Math.max(page, 0), Math.max(testimonyPages.length - 1, 0));
  }

  function playTestimonyInline(video) {
    flushSync(() => {
      setActiveVideo(video);
    });

    const player = activeInlineTestimonyVideoRef.current;
    if (!player || typeof player.play !== 'function') {
      return;
    }

    player.currentTime = 0;
    player.play().catch(() => {
      // If the browser blocks autoplay, the native controls remain visible for manual play.
    });
  }

  function scrollTestimony(direction) {
    setTestimonyPage((current) => clampTestimonyPage(current + direction));
  }

  function setTestimonyPageFromSlidebar(event) {
    const track = slidebarRef.current?.querySelector('.testimony-slidebar-track');
    if (!track || testimonyPages.length <= 1) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const progress = Math.min(Math.max((event.clientX - rect.left) / Math.max(rect.width, 1), 0), 1);
    setTestimonyPage(clampTestimonyPage(Math.round(progress * (testimonyPages.length - 1))));
  }

  function beginTestimonySlidebarDrag(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    isTestimonySlidebarDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setTestimonyPageFromSlidebar(event);
    event.preventDefault();
  }

  function updateTestimonySlidebarDrag(event) {
    if (!isTestimonySlidebarDraggingRef.current) {
      return;
    }

    setTestimonyPageFromSlidebar(event);
  }

  function endTestimonySlidebarDrag(event) {
    if (!isTestimonySlidebarDraggingRef.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    isTestimonySlidebarDraggingRef.current = false;
  }

  function handleTestimonyWheel(event) {
    if (testimonyDragStartRef.current !== null) {
      return;
    }

    const wheelDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(wheelDelta) < 24) {
      return;
    }

    event.preventDefault();
    scrollTestimony(wheelDelta > 0 ? 1 : -1);
  }

  function settleTestimonyDrag() {
    const slider = sliderRef.current;
    if (!slider) {
      setIsTestimonyDragging(false);
      testimonyDragStartRef.current = null;
      testimonyDragDeltaRef.current = 0;
      testimonyDraggingActiveRef.current = false;
      setTestimonyDragDelta(0);
      return;
    }

    const width = slider.clientWidth || 1;
    const dragDelta = testimonyDragDeltaRef.current;
    const swipeThreshold = Math.min(170, width * 0.24);
    const pageOffset = Math.abs(dragDelta) > swipeThreshold ? (dragDelta < 0 ? 1 : -1) : 0;

    if (pageOffset !== 0) {
      setTestimonyPage((current) => clampTestimonyPage(current + pageOffset));
    }

    ignoreTestimonyClickRef.current = Math.abs(dragDelta) > 10;
    window.setTimeout(() => {
      ignoreTestimonyClickRef.current = false;
    }, 0);
    setIsTestimonyDragging(false);
    testimonyDragStartRef.current = null;
    testimonyDragDeltaRef.current = 0;
    testimonyDraggingActiveRef.current = false;
    setTestimonyDragDelta(0);
  }

  function beginTestimonyDrag(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    setIsTestimonyDragging(false);
    testimonyDragStartRef.current = event.clientX;
    testimonyDragDeltaRef.current = 0;
    testimonyDraggingActiveRef.current = false;
    ignoreTestimonyClickRef.current = false;
    setTestimonyDragDelta(0);
  }

  function updateTestimonyDrag(event) {
    if (testimonyDragStartRef.current === null) {
      return;
    }

    const nextDelta = event.clientX - testimonyDragStartRef.current;
    if (!testimonyDraggingActiveRef.current && Math.abs(nextDelta) < 12) {
      return;
    }

    if (!testimonyDraggingActiveRef.current) {
      testimonyDraggingActiveRef.current = true;
      setIsTestimonyDragging(true);
      ignoreTestimonyClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    testimonyDragDeltaRef.current = nextDelta;
    setTestimonyDragDelta(nextDelta * 0.34);
  }

  function endTestimonyDrag(event) {
    if (testimonyDragStartRef.current === null) {
      return;
    }

    if (!testimonyDraggingActiveRef.current) {
      testimonyDragStartRef.current = null;
      testimonyDragDeltaRef.current = 0;
      testimonyDraggingActiveRef.current = false;
      setIsTestimonyDragging(false);
      setTestimonyDragDelta(0);
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    settleTestimonyDrag();
  }

  return (
    <main className="screen about-screen testimony-screen title-simple-page">
      <section className="about-panel testimony-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>CUSTOMER TESTIMONY</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="testimony-content" aria-label={`${activeCategory?.label ?? 'Customer'} testimony videos`}>
          <div className="testimony-category-tabs" role="tablist" aria-label="Testimony categories">
            {testimonyCategories.map((category) => {
              const CategoryIcon = testimonyCategoryIcons[category.id] ?? Users;
              const isActive = category.id === activeCategoryId;

              return (
                <button
                  type="button"
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`testimony-category-tab ${isActive ? 'active' : ''}`}
                  onClick={() => selectTestimonyCategory(category.id)}
                >
                  <span className="testimony-category-tab-icon" aria-hidden="true">
                    <CategoryIcon strokeWidth={2} />
                  </span>
                  <span className="testimony-category-tab-label">{category.label}</span>
                  <span className="testimony-category-tab-count">{category.videos.length}</span>
                </button>
              );
            })}
          </div>

          <div className="testimony-slider-shell">
            <div
              className={`testimony-slider ${isTestimonyDragging ? 'dragging' : ''}`}
              ref={sliderRef}
              style={{
                '--testimony-page': testimonyPage,
                '--testimony-drag-x': `${testimonyDragDelta}px`,
              }}
              onPointerDown={beginTestimonyDrag}
              onPointerMove={updateTestimonyDrag}
              onPointerUp={endTestimonyDrag}
              onPointerCancel={endTestimonyDrag}
              onWheel={handleTestimonyWheel}
            >
              <div className="testimony-slider-track">
                {testimonyPages.map((pageVideos, pageIndex) => (
                  <div className="testimony-slide-page" key={`testimony-page-${pageIndex}`}>
                    {pageVideos.map((video, videoIndex) => {
                      const absoluteIndex = pageIndex * testimonyVideosPerSlide + videoIndex;
                      const isActive = activeVideo?.src === video.src;

                      return (
                        <article
                          className={`gallery-video-tile testimony-video-tile ${isActive ? 'playing' : ''}`}
                          key={video.src}
                          role={isActive ? undefined : 'button'}
                          tabIndex={isActive ? undefined : 0}
                          onClick={() => {
                            if (isActive || ignoreTestimonyClickRef.current) {
                              return;
                            }

                            playTestimonyInline(video);
                          }}
                          onKeyDown={(event) => {
                            if (isActive) {
                              return;
                            }

                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              playTestimonyInline(video);
                            }
                          }}
                          aria-label={isActive ? undefined : `Play testimony video ${absoluteIndex + 1}: ${video.title}`}
                        >
                          {isActive ? (
                            <>
                            <video
                              key={video.src}
                              ref={activeInlineTestimonyVideoRef}
                              src={video.src}
                              poster={video.poster}
                              controls
                              autoPlay
                              playsInline
                              preload="metadata"
                              aria-label={video.title}
                              onPointerDownCapture={(event) => event.stopPropagation()}
                              onPointerMoveCapture={(event) => event.stopPropagation()}
                              onPointerUpCapture={(event) => event.stopPropagation()}
                              onClick={(event) => event.stopPropagation()}
                            />
                            <VideoVolumeControl videoRef={activeInlineTestimonyVideoRef} mediaKey={video.src} />
                            </>
                          ) : (
                            <>
                              <img src={video.poster} alt="" loading="lazy" decoding="async" draggable="false" aria-hidden="true" />
                              <div className="testimony-video-overlay" aria-hidden="true">
                                <strong>{video.title}</strong>
                              </div>
                              <span className="gallery-play-dot" aria-hidden="true">
                                <Play fill="currentColor" strokeWidth={1.8} />
                              </span>
                            </>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="testimony-slidebar"
              ref={slidebarRef}
              style={{
                '--testimony-step-count': testimonyPages.length,
                '--testimony-progress': testimonyPages.length > 1 ? testimonyPage / (testimonyPages.length - 1) : 0,
                '--testimony-progress-percent': `${testimonyPages.length > 1 ? (testimonyPage / (testimonyPages.length - 1)) * 100 : 0}%`,
              }}
              aria-label="Customer testimony slide progress"
            >
              <span
                className="testimony-slidebar-track"
                role="slider"
                tabIndex={0}
                aria-valuemin={1}
                aria-valuemax={testimonyPages.length}
                aria-valuenow={testimonyPage + 1}
                aria-label="Move customer testimony slides"
                onPointerDown={beginTestimonySlidebarDrag}
                onPointerMove={updateTestimonySlidebarDrag}
                onPointerUp={endTestimonySlidebarDrag}
                onPointerCancel={endTestimonySlidebarDrag}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    scrollTestimony(-1);
                  }

                  if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollTestimony(1);
                  }
                }}
              >
                <span className="testimony-slidebar-fill" />
                <span className="testimony-slidebar-thumb" />
              </span>
              <span className="testimony-slidebar-steps">
                {testimonyPages.map((_, pageIndex) => (
                  <button
                    className={`testimony-slidebar-step ${pageIndex === testimonyPage ? 'active' : ''}`}
                    key={`testimony-step-${pageIndex}`}
                    type="button"
                    onClick={() => setTestimonyPage(pageIndex)}
                    aria-label={`Show customer testimony slide ${pageIndex + 1}`}
                    aria-current={pageIndex === testimonyPage ? 'true' : undefined}
                  />
                ))}
              </span>
            </div>
          </div>
        </section>

        <PrimaryNav activePage="customer-testimony" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
