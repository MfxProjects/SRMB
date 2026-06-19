import React, { useEffect, useRef, useState } from 'react';
import '../styles/pages/CsrPage.css';
import { GraduationCap, HandHeart, HeartPulse, Leaf, Sparkles } from 'lucide-react';
import { PrimaryNav } from '../components/shared.jsx';

const initiatives = [
  {
    id: 'women',
    title: 'Women Empowerment',
    eyebrow: 'Skills that build independence',
    description: 'Creating pathways for women to learn practical skills, grow in confidence, and build stronger, self-reliant futures for their families and communities.',
    tags: ['Skill development', 'Equal opportunity', 'Self-reliance'],
    icon: Sparkles,
    accent: '#f0b44b',
    fit: 'contain',
    images: [
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider1.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider2.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider3.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider4.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider5.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider7.jpg',
      '/assets/we%20care/womenEmpowerment/WomenEmpowermentSlider8.jpg',
    ],
  },
  {
    id: 'education',
    title: 'Education Program',
    eyebrow: 'Learning opens every door',
    description: 'Supporting meaningful learning experiences through classrooms, books, digital access, and opportunities that help young minds discover their potential.',
    tags: ['Better access', 'Digital learning', 'Brighter futures'],
    icon: GraduationCap,
    accent: '#58b7e8',
    images: [
      '/assets/we%20care/EducationalProgram/Jun%2018,%202026,%2002_32_41%20PM-optimized.webp',
      '/assets/we%20care/EducationalProgram/Jun%2018,%202026,%2002_33_13%20PM-optimized.webp',
    ],
  },
  {
    id: 'green',
    title: 'Green Future',
    eyebrow: 'Growing responsibility together',
    description: 'Encouraging tree planting, greener surroundings, and everyday environmental awareness to help communities choose a more sustainable tomorrow.',
    tags: ['Tree plantation', 'Eco awareness', 'Responsible choices'],
    icon: Leaf,
    accent: '#67c77a',
    fit: 'contain',
    images: ['/assets/we%20care/greenFuture/greentnt-ban.png'],
  },
  {
    id: 'relief',
    title: 'Relief Work',
    eyebrow: 'Standing together when it matters',
    description: 'Reaching communities affected by natural calamities with essential supplies, immediate support, and care that helps families begin rebuilding their lives.',
    tags: ['Rapid response', 'Essential supplies', 'Community recovery'],
    icon: HandHeart,
    accent: '#ef8b57',
    images: ['/assets/we%20care/reliefWork/relife-ban.png'],
  },
  {
    id: 'health',
    title: 'Health & Support',
    eyebrow: 'Care within everyone\'s reach',
    description: 'Bringing health services closer to people through medical checkups, consultations, awareness programs, blood donation, and essential support.',
    tags: ['Health camps', 'Preventive care', 'Medical support'],
    icon: HeartPulse,
    accent: '#dc6f8f',
    images: [
      '/assets/we%20care/Health/3449aadf-8e14-4f90-9524-9eb3b588fed2-optimized.webp',
      '/assets/we%20care/Health/ebf6615d-368b-427c-8aa1-81d911c44fa5-optimized.webp',
    ],
  },
];

export default function CsrPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const swipeStart = useRef(null);
  const activeInitiative = initiatives[activeIndex];
  const activeImage = activeInitiative.images[imageIndex];

  useEffect(() => {
    if (activeInitiative.images.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % activeInitiative.images.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [activeIndex, activeInitiative.images.length]);

  function selectInitiative(index) {
    setActiveIndex(index);
    setImageIndex(0);
  }

  function moveImage(direction) {
    const imageCount = activeInitiative.images.length;
    setImageIndex((current) => (current + direction + imageCount) % imageCount);
  }

  function startImageSwipe(event) {
    if (activeInitiative.images.length < 2) return;

    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function finishImageSwipe(event) {
    if (activeInitiative.images.length < 2 || !swipeStart.current) return;

    const deltaX = event.clientX - swipeStart.current.x;
    const deltaY = event.clientY - swipeStart.current.y;
    swipeStart.current = null;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

    moveImage(deltaX < 0 ? 1 : -1);
  }

  const ActiveIcon = activeInitiative.icon;

  return (
    <main className="screen about-screen csr-screen title-simple-page">
      <section className="about-panel csr-panel">
        <header className="about-header csr-header">
          <div className="about-title-bar">
            <h1>SRMB WE CARE</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section
          className="csr-content"
          aria-label="SRMB community initiatives"
          style={{ '--csr-accent': activeInitiative.accent, '--csr-image': `url("${activeImage}")` }}
        >
          <nav className="csr-initiative-rail" aria-label="Choose an SRMB We Care initiative">
            {initiatives.map((initiative, index) => {
              const InitiativeIcon = initiative.icon;
              return (
                <button
                  className={`csr-initiative-button ${index === activeIndex ? 'active' : ''}`}
                  key={initiative.id}
                  type="button"
                  onClick={() => selectInitiative(index)}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  style={{ '--initiative-accent': initiative.accent }}
                >
                  <span className="csr-initiative-icon"><InitiativeIcon aria-hidden="true" /></span>
                  <span className="csr-initiative-copy">
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong>{initiative.title}</strong>
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className={`csr-visual csr-visual-${activeInitiative.id}`}
            onPointerDown={startImageSwipe}
            onPointerUp={finishImageSwipe}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <img
              key={activeImage}
              src={activeImage}
              alt={`${activeInitiative.title} initiative`}
              decoding="async"
              fetchPriority="high"
              style={{ objectFit: activeInitiative.fit || 'cover' }}
            />
            <div className="csr-visual-shade" />

            <div className="csr-gallery-dots" aria-label={`${activeInitiative.title} image selection`}>
              {activeInitiative.images.map((image, index) => (
                <button
                  className={index === imageIndex ? 'active' : ''}
                  key={image}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === imageIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>

          <aside className="csr-story" key={activeInitiative.id}>
            <div className="csr-story-icon"><ActiveIcon aria-hidden="true" /></div>
            <span className="csr-story-number">INITIATIVE {String(activeIndex + 1).padStart(2, '0')}</span>
            <h2>{activeInitiative.title}</h2>
            <p className="csr-story-eyebrow">{activeInitiative.eyebrow}</p>
            <div className="csr-story-rule" />
            <p className="csr-story-description">{activeInitiative.description}</p>
            <div className="csr-story-tags">
              {activeInitiative.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <blockquote>Care creates stronger communities.</blockquote>
          </aside>
        </section>

        <PrimaryNav activePage="csr" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
