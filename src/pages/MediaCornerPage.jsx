import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/MediaCornerPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Categorized media player for TV commercials, press coverage, and talk shows.
export default function MediaCornerPage({ onNavigate }) {
  const [activeSectionId, setActiveSectionId] = useState(mediaCornerSections[0].id);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);
  const videoRef = useRef(null);
  const autoplaySelectedVideoRef = useRef(false);
  const activeSection = mediaCornerSections.find((section) => section.id === activeSectionId) || mediaCornerSections[0];
  const activeVideo = activeSection.videos[activeVideoIndex] || activeSection.videos[0];
  const shouldAutoplayActiveVideo = activeSectionId === mediaCornerSections[0].id && activeVideoIndex === 0;

  function pauseCurrentVideo() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();
  }

  function startActiveVideo({ muted = false } = {}) {
    const video = videoRef.current;

    if (!video || typeof video.play !== 'function') {
      return;
    }

    video.muted = muted;
    video.defaultMuted = muted;
    video.currentTime = 0;

    const playWhenReady = () => {
      video.play().catch(() => {
        // Native controls remain visible if the browser asks for a second tap.
      });
    };

    if (video.readyState >= 2) {
      playWhenReady();
      return;
    }

    video.addEventListener('loadeddata', playWhenReady, { once: true });
    video.load();
  }

  useEffect(() => {
    const video = videoRef.current;
    const shouldPlaySelectedVideo = autoplaySelectedVideoRef.current;

    setDuration(0);
    setVideoError('');
    setIsVideoLoading(true);
    setVideoAspectRatio(16 / 9);

    if (video) {
      video.muted = shouldAutoplayActiveVideo && !shouldPlaySelectedVideo;
      video.defaultMuted = shouldAutoplayActiveVideo && !shouldPlaySelectedVideo;

      if (!shouldPlaySelectedVideo) {
        video.pause();
        video.currentTime = 0;
        video.load();
      }

      if (shouldAutoplayActiveVideo && !shouldPlaySelectedVideo) {
        const tryPlay = () => {
          video.play().catch(() => {});
        };

        if (video.readyState >= 2) {
          tryPlay();
        } else {
          video.addEventListener('loadeddata', tryPlay, { once: true });
        }
      }
    }

    autoplaySelectedVideoRef.current = false;
  }, [activeVideo.src, shouldAutoplayActiveVideo]);

  useEffect(() => pauseCurrentVideo, []);

  function showSection(sectionId) {
    pauseCurrentVideo();
    autoplaySelectedVideoRef.current = true;

    flushSync(() => {
      setActiveSectionId(sectionId);
      setActiveVideoIndex(0);
    });

    startActiveVideo();
  }

  function playSelectedVideo(index) {
    pauseCurrentVideo();
    autoplaySelectedVideoRef.current = true;

    flushSync(() => {
      setActiveVideoIndex(index);
    });

    startActiveVideo();
  }

  function handleNavigate(nextPage) {
    pauseCurrentVideo();
    onNavigate(nextPage);
  }

  function syncVideoDuration(video) {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
      setIsVideoLoading(false);
    }

    if (video.videoWidth > 0 && video.videoHeight > 0) {
      setVideoAspectRatio(video.videoWidth / video.videoHeight);
    }
  }

  return (
    <main className="screen about-screen media-corner-screen title-simple-page">
      <section className="about-panel media-corner-panel">
        <header className="about-header media-corner-header">
          <div className="about-title-bar">
            <h1>MEDIA CORNER</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="media-corner-stage" aria-label="Media Corner videos">
          <div className={`media-showcase ${activeSection.accent}`}>
            <article className="media-player-card">
              <div
                className="media-video-frame"
                style={{ '--media-video-aspect': videoAspectRatio }}
              >
                <video
                  key={activeVideo.src}
                  ref={videoRef}
                  controls
                  autoPlay={shouldAutoplayActiveVideo}
                  muted={shouldAutoplayActiveVideo}
                  poster={shouldAutoplayActiveVideo ? undefined : activeVideo.poster}
                  preload={shouldAutoplayActiveVideo ? 'auto' : 'metadata'}
                  playsInline
                  src={activeVideo.src}
                  onLoadedMetadata={(event) => syncVideoDuration(event.currentTarget)}
                  onDurationChange={(event) => syncVideoDuration(event.currentTarget)}
                  onCanPlay={(event) => syncVideoDuration(event.currentTarget)}
                  onError={() => {
                    setIsVideoLoading(false);
                    setVideoError('This video could not be loaded. Please check the file in Media Corner folder.');
                  }}
                />
                {isVideoLoading && !videoError && <span className="media-video-loading">Loading video...</span>}
                {videoError && <span className="media-video-error">{videoError}</span>}
              </div>
            </article>

            <aside className="media-video-list" aria-label={`${activeSection.title} videos`}>
              {activeSection.videos.map((video, index) => (
                <button
                  key={video.src}
                  className={index === activeVideoIndex ? 'active' : ''}
                  type="button"
                  onClick={() => playSelectedVideo(index)}
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={video.poster}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                  <Play className="media-thumb-play" aria-hidden="true" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{video.title}</strong>
                  <small>{video.meta}</small>
                </button>
              ))}
            </aside>
          </div>

          <div className="media-corner-tabs" role="tablist" aria-label="Media categories">
            {mediaCornerSections.map((section) => {
              const isActive = section.id === activeSection.id;

              return (
                <button
                  key={section.id}
                  className={`media-category-card ${section.accent} ${isActive ? 'active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => showSection(section.id)}
                >
                  {section.title}
                </button>
              );
            })}
          </div>
        </section>

        <PrimaryNav activePage="media-corner" onNavigate={handleNavigate} />
      </section>
    </main>
  );
}
