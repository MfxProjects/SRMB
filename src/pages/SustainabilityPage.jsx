import React, { useEffect, useRef, useState } from 'react';
import '../styles/pages/SustainabilityPage.css';
import '../styles/kiosk-overrides.css';
import { BadgeCheck, BookOpen, ChevronLeft, ChevronRight, FileText, Leaf } from 'lucide-react';
import { PrimaryNav } from '../components/shared.jsx';

function renderedAsset(folder, fileName) {
  return `/assets/sustanibility/rendered/${folder}/${fileName}`;
}

function renderedPages(folder, prefix, count) {
  return Array.from({ length: count }, (_, index) => renderedAsset(folder, `${prefix}-${String(index + 1).padStart(3, '0')}.jpg`));
}

const sustainabilityTopics = [
  {
    id: 'green-steel',
    title: 'Green Steel',
    label: 'Certificate',
    accent: '#67c77a',
    icon: Leaf,
    documents: [
      {
        title: 'Green Steel Certificate',
        fileName: 'Green Steel Certificate - SRMB SRIJAN PVT. LTD..pdf',
        pages: renderedPages('green-steel', 'green-steel', 1),
      },
    ],
  },
  {
    id: 'greenpro',
    title: 'GreenPro',
    label: 'Certificate',
    accent: '#5ec8d8',
    icon: BadgeCheck,
    documents: [
      {
        title: 'GreenPro Certificate',
        fileName: 'GreenPro SRMB.pdf',
        pages: renderedPages('greenpro', 'greenpro', 2),
      },
    ],
  },
  {
    id: 'esg',
    title: 'ESG Reports',
    label: 'Reports',
    accent: '#f0c65f',
    icon: FileText,
    documents: [
      {
        title: 'Sustainability Report 2024-25',
        fileName: 'SRMB_Sustainability_Report 2024-25.pdf',
        pages: renderedPages('report-2024-25', 'page', 68),
      },
      {
        title: 'Sustainability Report 2023-24',
        fileName: 'SRMB_Sustainability_Report 2023-24 .pdf',
        pages: renderedPages('report-2023-24', 'page', 44),
      },
    ],
  },
];

export default function SustainabilityPage({ onNavigate }) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const pageSwipeStart = useRef(null);
  const activeTopic = sustainabilityTopics[activeTopicIndex];
  const activeDocument = activeTopic.documents[activeDocumentIndex] || activeTopic.documents[0];
  const isReport = activeTopic.id === 'esg';
  const pageStep = isReport ? 2 : 1;
  const currentPages = activeDocument.pages || [];
  const canGoBack = activePageIndex > 0;
  const canGoNext = activePageIndex + pageStep < currentPages.length;

  useEffect(() => {
    setActivePageIndex(0);
  }, [activeTopicIndex, activeDocumentIndex]);

  function selectTopic(index) {
    setActiveTopicIndex(index);
    setActiveDocumentIndex(0);
  }

  function movePage(direction) {
    setActivePageIndex((current) => {
      const next = current + (direction * pageStep);
      const maxIndex = Math.max(currentPages.length - 1, 0);
      return Math.min(Math.max(next, 0), maxIndex);
    });
  }

  function startPageSwipe(event) {
    if (currentPages.length < 2) return;

    pageSwipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function finishPageSwipe(event) {
    if (currentPages.length < 2 || !pageSwipeStart.current) return;

    const deltaX = event.clientX - pageSwipeStart.current.x;
    const deltaY = event.clientY - pageSwipeStart.current.y;
    pageSwipeStart.current = null;

    if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;

    if (deltaX < 0 && canGoNext) {
      movePage(1);
    } else if (deltaX > 0 && canGoBack) {
      movePage(-1);
    }
  }

  return (
    <main className="screen about-screen sustainability-screen title-simple-page">
      <section className="about-panel sustainability-panel">
        <header className="about-header sustainability-header">
          <div className="about-title-bar">
            <h1>SUSTAINABILITY</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section
          className="sustainability-content"
          aria-label="SRMB sustainability documents"
          style={{ '--sustainability-accent': activeTopic.accent }}
        >
          <nav className="sustainability-card-grid" aria-label="Choose sustainability section">
            {sustainabilityTopics.map((topic, index) => {
              const TopicIcon = topic.icon;

              return (
                <button
                  className={`sustainability-choice ${index === activeTopicIndex ? 'active' : ''}`}
                  key={topic.id}
                  type="button"
                  onClick={() => selectTopic(index)}
                  style={{ '--topic-accent': topic.accent }}
                  aria-current={index === activeTopicIndex ? 'true' : undefined}
                >
                  <span className="sustainability-choice-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="sustainability-choice-icon"><TopicIcon aria-hidden="true" /></span>
                  <strong>{topic.title}</strong>
                  <small>{topic.label}</small>
                </button>
              );
            })}
          </nav>

          <section className={`sustainability-document-stage ${isReport ? 'report-stage' : 'sustainability-certificate-stage'}`} aria-label={`${activeTopic.title} document preview`}>
            {activeTopic.documents.length > 1 && (
              <div className="sustainability-report-tabs" aria-label="ESG report years">
                {activeTopic.documents.map((document, index) => (
                  <button
                    className={index === activeDocumentIndex ? 'active' : ''}
                    key={document.fileName}
                    type="button"
                    onClick={() => setActiveDocumentIndex(index)}
                  >
                    {document.title.replace('Sustainability Report ', '')}
                  </button>
                ))}
              </div>
            )}

            <div
              className={`sustainability-viewer ${isReport ? 'book-viewer' : 'certificate-viewer'}`}
              onPointerDown={startPageSwipe}
              onPointerUp={finishPageSwipe}
              onPointerCancel={() => {
                pageSwipeStart.current = null;
              }}
            >
              {isReport ? (
                <>
                  <div className="sustainability-book" key={`${activeDocument.fileName}-${activePageIndex}`}>
                    <div className="sustainability-book-spine" aria-hidden="true" />
                    {[0, 1].map((offset) => {
                      const pageSrc = currentPages[activePageIndex + offset];
                      const pageNumber = activePageIndex + offset + 1;

                      return (
                        <div className={`sustainability-book-page page-${offset}`} key={`${pageSrc || 'blank'}-${offset}`}>
                          {pageSrc ? (
                            <>
                              <img src={pageSrc} alt={`${activeDocument.title} page ${pageNumber}`} draggable="false" />
                              <span>{pageNumber}</span>
                            </>
                          ) : (
                            <div className="sustainability-book-blank" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="sustainability-book-status">
                    <BookOpen aria-hidden="true" />
                    <span>Page {activePageIndex + 1}-{Math.min(activePageIndex + 2, currentPages.length)} / {currentPages.length}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="sustainability-certificate-wrap" key={`${activeDocument.fileName}-${activePageIndex}`}>
                    <img
                      src={currentPages[activePageIndex]}
                      alt={`${activeDocument.title} page ${activePageIndex + 1}`}
                      draggable="false"
                    />
                  </div>

                  {currentPages.length > 1 && (
                    <div className="sustainability-certificate-controls">
                      <button type="button" onClick={() => movePage(-1)} disabled={!canGoBack} aria-label="Previous certificate page">
                        <ChevronLeft aria-hidden="true" />
                      </button>
                      <span>{activePageIndex + 1} / {currentPages.length}</span>
                      <button type="button" onClick={() => movePage(1)} disabled={!canGoNext} aria-label="Next certificate page">
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </section>

        <PrimaryNav activePage="sustainability" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
