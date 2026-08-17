import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/ProductsPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Product-category browser with draggable brochure-page carousels.
export default function ProductsPage({ onNavigate }) {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const activeProduct = productSlides[activeProductIndex] || productSlides[0];
  const activeProductPages = activeProduct.pages;
  const activeProductPage = activeProductPages[activePageIndex] || activeProductPages[0];

  function moveSlide(direction) {
    if (activeProductPages.length < 2) {
      return;
    }

    setActivePageIndex((current) => (current + direction + activeProductPages.length) % activeProductPages.length);
  }

  function beginDrag(event) {
    if (activeProductPages.length < 2) {
      return;
    }

    setDragStart(event.clientX);
    setDragDelta(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateDrag(event) {
    if (dragStart === null) {
      return;
    }
    setDragDelta(event.clientX - dragStart);
  }

  function endDrag() {
    if (dragStart !== null && Math.abs(dragDelta) > 58) {
      moveSlide(dragDelta < 0 ? 1 : -1);
    }
    setDragStart(null);
    setDragDelta(0);
  }

  const gallerySlides = activeProductPages.length > 1
    ? [-1, 0, 1].map((offset) => {
        const index = (activePageIndex + offset + activeProductPages.length) % activeProductPages.length;
        return { ...activeProductPages[index], index, offset };
      })
    : [{ ...activeProductPage, index: 0, offset: 0 }];

  return (
    <main className="screen about-screen products-screen title-simple-page">
      <section className="about-panel products-panel">
        <header className="about-header products-header">
          <div className="about-title-bar products-title-bar">
            <h1>PRODUCTS</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="products-stage" aria-label="Products">
          <aside className="product-menu" aria-label="Product categories">
            {productSlides.map((slide, index) => (
              <button
                key={slide.label}
                className={index === activeProductIndex ? 'active' : ''}
                onClick={() => {
                  setActiveProductIndex(index);
                  setActivePageIndex(0);
                }}
                type="button"
              >
                {slide.label}
              </button>
            ))}
          </aside>

          <section className="product-brochure" aria-label={`${activeProduct.label} brochure pages`}>
            <div
              className={`product-gallery ${activeProductPage.crop ? `${activeProductPage.crop}-gallery` : ''} ${dragStart !== null ? 'dragging' : ''}`}
              onPointerDown={beginDrag}
              onPointerMove={updateDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{ '--drag-x': `${dragDelta}px` }}
            >
              <div className="product-gallery-track" aria-live="polite">
                {gallerySlides.map((slide) => (
                  <button
                    key={`${slide.image}-${slide.offset}`}
                    className={`product-gallery-card offset-${slide.offset} ${slide.crop ? `${slide.crop}-crop` : ''}`}
                    onClick={() => setActivePageIndex(slide.index)}
                    type="button"
                    aria-label={`Show ${activeProduct.label} brochure page ${slide.number}`}
                  >
                    <img src={slide.image} alt={`${activeProduct.label} brochure page ${slide.number}`} draggable="false" />
                  </button>
                ))}
              </div>
            </div>

            <div className="small-pager" aria-label="Product page controls">
              <button onClick={() => moveSlide(-1)} type="button" disabled={activeProductPages.length < 2}>&#8249;</button>
              <button onClick={() => moveSlide(1)} type="button" disabled={activeProductPages.length < 2}>&#8250;</button>
            </div>
          </section>
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === 'products' ? 'active' : ''}`}
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
