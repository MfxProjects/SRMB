import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/ProjectsPage.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Showcases completed projects and RealNail products through image carousels.
export default function ProjectsPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isProjectLightboxOpen, setIsProjectLightboxOpen] = useState(false);
  const [projectDragStart, setProjectDragStart] = useState(null);
  const [projectDragDelta, setProjectDragDelta] = useState(0);
  const projectDragStartRef = useRef(null);
  const projectDragDeltaRef = useRef(0);
  const ignoreProjectClickRef = useRef(false);
  const [projectLightboxDragStart, setProjectLightboxDragStart] = useState(null);
  const [projectLightboxDragDelta, setProjectLightboxDragDelta] = useState(0);
  const projectLightboxDragStartRef = useRef(null);
  const projectLightboxDragDeltaRef = useRef(0);

  function moveProject(direction) {
    setActiveIndex((current) => (current + direction + projectSlides.length) % projectSlides.length);
  }

  useEffect(() => {
    if (isProjectLightboxOpen || projectDragStart !== null || projectLightboxDragStart !== null || projectSlides.length < 2) {
      return undefined;
    }

    const autoAdvanceProjects = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projectSlides.length);
    }, 3000);

    return () => window.clearInterval(autoAdvanceProjects);
  }, [isProjectLightboxOpen, projectDragStart, projectLightboxDragStart]);

  function beginProjectDrag(event) {
    projectDragStartRef.current = event.clientX;
    projectDragDeltaRef.current = 0;
    setProjectDragStart(event.clientX);
    setProjectDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateProjectDrag(event) {
    if (projectDragStartRef.current === null) {
      return;
    }
    const nextDelta = event.clientX - projectDragStartRef.current;
    projectDragDeltaRef.current = nextDelta;
    setProjectDragDelta(nextDelta);
  }

  function endProjectDrag(event) {
    if (projectDragStartRef.current !== null && Math.abs(projectDragDeltaRef.current) > 58) {
      moveProject(projectDragDeltaRef.current < 0 ? 1 : -1);
      ignoreProjectClickRef.current = true;
    } else if (projectDragStartRef.current !== null) {
      const projectButton = document.elementFromPoint(event.clientX, event.clientY)?.closest('.project-frame');
      if (projectButton?.dataset.projectIndex) {
        setActiveIndex(Number(projectButton.dataset.projectIndex));
        setIsProjectLightboxOpen(true);
      }
    }
    projectDragStartRef.current = null;
    projectDragDeltaRef.current = 0;
    setProjectDragStart(null);
    setProjectDragDelta(0);
  }

  function selectProject(index) {
    if (ignoreProjectClickRef.current) {
      ignoreProjectClickRef.current = false;
      return;
    }
    setActiveIndex(index);
    setIsProjectLightboxOpen(true);
  }

  function beginProjectLightboxDrag(event) {
    projectLightboxDragStartRef.current = event.clientX;
    projectLightboxDragDeltaRef.current = 0;
    setProjectLightboxDragStart(event.clientX);
    setProjectLightboxDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateProjectLightboxDrag(event) {
    if (projectLightboxDragStartRef.current === null) {
      return;
    }
    const nextDelta = event.clientX - projectLightboxDragStartRef.current;
    projectLightboxDragDeltaRef.current = nextDelta;
    setProjectLightboxDragDelta(nextDelta);
  }

  function endProjectLightboxDrag() {
    if (projectLightboxDragStartRef.current !== null && Math.abs(projectLightboxDragDeltaRef.current) > 58) {
      moveProject(projectLightboxDragDeltaRef.current < 0 ? 1 : -1);
    }
    projectLightboxDragStartRef.current = null;
    projectLightboxDragDeltaRef.current = 0;
    setProjectLightboxDragStart(null);
    setProjectLightboxDragDelta(0);
  }

  const visibleProjects = [-1, 0, 1, 2, 3].map((offset) => {
    const index = (activeIndex + offset + projectSlides.length) % projectSlides.length;
    return { image: projectSlides[index], offset, index };
  });

  return (
    <main className="screen about-screen projects-screen title-simple-page">
      <section className="about-panel projects-panel">
        <header className="about-header projects-header">
          <div className="about-title-bar projects-title-bar">
            <h1>ICONIC PROJECTS</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="projects-content" aria-label="Iconic projects">
          <div
            className={`project-carousel ${projectDragStart !== null ? 'dragging' : ''}`}
            onPointerDown={beginProjectDrag}
            onPointerMove={updateProjectDrag}
            onPointerUp={endProjectDrag}
            onPointerCancel={endProjectDrag}
            onDragStart={(event) => event.preventDefault()}
            style={{ '--project-drag-x': `${projectDragDelta}px` }}
          >
            <div className="project-strip" aria-live="polite">
              {visibleProjects.map((project) => (
                <button
                  key={`${project.image}-${project.offset}`}
                  className={`project-frame offset-${project.offset}`}
                  data-project-index={project.index}
                  onClick={() => selectProject(project.index)}
                  type="button"
                  aria-label={`Show project ${project.index + 1}`}
                >
                  <img src={project.image} alt="" draggable="false" />
                </button>
              ))}
            </div>
          </div>

          <div className="project-pager" aria-label="Project slide controls">
            <button onClick={() => moveProject(-1)} type="button">&#8249;</button>
            <button onClick={() => moveProject(1)} type="button">&#8250;</button>
          </div>

          <h2>
            A Legacy of Excellence and Innovation, Shaping Skylines &amp; Transforming<br />
            Communities with Unmatched Quality and Vision
          </h2>
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="about-nav-item"
              onClick={() => onNavigate(item.page)}
              type="button"
            >
              <img className={item.className || ''} src={item.icon} alt="" />
              <span>{item.shortLabel || item.label}</span>
            </button>
          ))}
        </nav>

        {isProjectLightboxOpen && (
          <div className="project-lightbox" role="dialog" aria-modal="true" aria-label="Project gallery viewer">
            <button
              className="project-lightbox-close"
              type="button"
              onClick={() => setIsProjectLightboxOpen(false)}
              aria-label="Close project viewer"
            >
              ×
            </button>

            <button className="project-lightbox-nav project-lightbox-prev" onClick={() => moveProject(-1)} type="button" aria-label="Previous project">
              &#8249;
            </button>

            <div
              className={`project-lightbox-stage ${projectLightboxDragStart !== null ? 'dragging' : ''}`}
              onPointerDown={beginProjectLightboxDrag}
              onPointerMove={updateProjectLightboxDrag}
              onPointerUp={endProjectLightboxDrag}
              onPointerCancel={endProjectLightboxDrag}
              style={{ '--project-lightbox-drag-x': `${projectLightboxDragDelta}px` }}
            >
              <img src={projectSlides[activeIndex]} alt="" draggable="false" />
            </div>

            <button className="project-lightbox-nav project-lightbox-next" onClick={() => moveProject(1)} type="button" aria-label="Next project">
              &#8250;
            </button>

            <div className="project-lightbox-dots" aria-label="Project slide controls">
              {projectSlides.map((project, index) => (
                <button
                  key={project}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                  aria-label={`Show project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
