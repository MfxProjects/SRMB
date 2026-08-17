import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/ContactPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Contains contact information, enquiry submission, and visitor feedback forms.
export default function ContactPage({ onNavigate }) {
  const [contactState, setContactState] = useState({
    name: '',
    mobile: '',
    email: '',
    requirement: '',
  });
  const [feedbackState, setFeedbackState] = useState({
    rating: 'Medium',
    comment: '',
  });
  const [contactSubmitState, setContactSubmitState] = useState({
    sending: false,
    type: '',
    message: '',
  });
  const [feedbackSubmitState, setFeedbackSubmitState] = useState({
    sending: false,
    type: '',
    message: '',
  });

  function handleContactInputChange(event) {
    const { name, value } = event.target;
    setContactState((current) => ({ ...current, [name]: value }));
  }

  function handleFeedbackInputChange(event) {
    const { name, value } = event.target;
    setFeedbackState((current) => ({ ...current, [name]: value }));
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    if (contactSubmitState.sending) {
      return;
    }

    const payload = {
      name: contactState.name.trim(),
      mobile: contactState.mobile.trim(),
      email: contactState.email.trim(),
      requirement: contactState.requirement.trim(),
    };

    if (!payload.name || !payload.mobile || !payload.email || !payload.requirement) {
      setContactSubmitState({
        sending: false,
        type: 'error',
        message: 'Please fill all contact fields before submitting.',
      });
      return;
    }

    setContactSubmitState({
      sending: false,
      type: 'success',
      message: 'Thank you. Your contact request was submitted successfully.',
    });
    setContactState({ name: '', mobile: '', email: '', requirement: '' });
  }

  function handleFeedbackSubmit(event) {
    event.preventDefault();
    if (feedbackSubmitState.sending) {
      return;
    }

    if (!feedbackState.rating || !feedbackState.comment.trim()) {
      setFeedbackSubmitState({
        sending: false,
        type: 'error',
        message: 'Please choose a mood and add a comment before submitting.',
      });
      return;
    }

    setFeedbackSubmitState({
      sending: false,
      type: 'success',
      message: 'Thank you. Your feedback was submitted successfully.',
    });
    setFeedbackState({ rating: 'Medium', comment: '' });
  }

  return (
    <main className="screen about-screen contact-screen title-simple-page">
      <section className="about-panel contact-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>FEEDBACK</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.jpg" alt="SRMB" />
          </div>
        </header>

        <section className="contact-content feedback-content" aria-label="SRMB contact and feedback forms">
          <form className="contact-form-card contact-us-card" aria-label="Contact us form" onSubmit={handleContactSubmit} noValidate>
            <h2 className="contact-card-heading">Contact Us</h2>
            <div className="contact-form-grid feedback-contact-grid">
              <input
                type="text"
                name="name"
                placeholder="Name"
                aria-label="Name"
                value={contactState.name}
                onChange={handleContactInputChange}
                autoComplete="off"
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                aria-label="Mobile Number"
                value={contactState.mobile}
                onChange={handleContactInputChange}
                inputMode="tel"
                autoComplete="off"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={contactState.email}
                onChange={handleContactInputChange}
                autoComplete="off"
              />
              <textarea
                name="requirement"
                placeholder="Requirement / Message"
                aria-label="Requirement or Message"
                value={contactState.requirement}
                onChange={handleContactInputChange}
              />
            </div>
            <button type="submit" disabled={contactSubmitState.sending}>
              {contactSubmitState.sending ? 'Sending...' : 'Submit Contact'}
            </button>
            {contactSubmitState.message && (
              <p className={`contact-status ${contactSubmitState.type === 'success' ? 'success' : 'error'}`} role="status">
                {contactSubmitState.message}
              </p>
            )}
          </form>

          <form className="contact-form-card feedback-form-card mood-feedback-card" aria-label="Feedback form" onSubmit={handleFeedbackSubmit} noValidate>
            <div className="mood-card-top">
              <div className="mood-title-lockup">
                <span className="feedback-card-icon" aria-hidden="true">
                  <ShieldCheck />
                </span>
                <span>Feedback</span>
              </div>
              <button
                className="mood-close-button"
                type="button"
                aria-label="Reset feedback"
                onClick={() => {
                  setFeedbackState({ rating: 'Medium', comment: '' });
                  setFeedbackSubmitState({ sending: false, type: '', message: '' });
                }}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="mood-heading">
              <h2>How are you feeling?</h2>
              <p>Your input is valuable in helping us better understand your needs and tailor our service accordingly.</p>
            </div>

            <div className="feedback-rating mood-rating" role="radiogroup" aria-label="How are you feeling?">
              {feedbackMoodOptions.map((rating) => (
                <button
                  key={rating.label}
                  className={feedbackState.rating === rating.label ? 'active' : ''}
                  type="button"
                  role="radio"
                  aria-checked={feedbackState.rating === rating.label}
                  onClick={() => {
                    setFeedbackState((current) => ({ ...current, rating: rating.label }));
                    setFeedbackSubmitState({ sending: false, type: '', message: '' });
                  }}
                >
                  <span className="feedback-emoji" aria-hidden="true">{rating.icon}</span>
                  {feedbackState.rating === rating.label && (
                    <span className="mood-tooltip">{rating.label}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="feedback-form-grid mood-comment-grid">
              <textarea
                name="comment"
                placeholder="Add a Comment..."
                aria-label="Feedback comment"
                value={feedbackState.comment}
                onChange={handleFeedbackInputChange}
              />
            </div>
            <button className="mood-submit-button" type="submit" disabled={feedbackSubmitState.sending}>
              {feedbackSubmitState.sending ? 'Sending...' : 'Submit Now'}
            </button>
            {feedbackSubmitState.message && (
              <p className={`contact-status ${feedbackSubmitState.type === 'success' ? 'success' : 'error'}`} role="status">
                {feedbackSubmitState.message}
              </p>
            )}
          </form>
        </section>

        <nav className="about-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`about-nav-item ${item.page === 'contact' ? 'active' : ''}`}
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
