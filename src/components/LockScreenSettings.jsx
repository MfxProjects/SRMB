import React, { useRef, useState } from 'react';
import {
  Check,
  Clock3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  MousePointerClick,
  MonitorPlay,
  Power,
  TimerReset,
  Upload,
  Unlock,
  Video,
  X,
} from 'lucide-react';
import { brandAmbassadorImage, corporateVideo, newTvcVideo } from '../data/appData.jsx';
import '../styles/pages/LockScreenSettings.css';

const clockStyles = [
  { id: 'glass', label: 'Glass', time: '10:24', detail: 'Logo and date' },
  { id: 'minimal', label: 'Minimal', time: '10:24', detail: 'Clean and simple' },
  { id: 'classic', label: 'Classic', time: '10:24', detail: 'Elegant serif' },
  { id: 'digital', label: 'Digital', time: '10:24', detail: 'LED display' },
];

const exitKeypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'erase', '0', 'enter'];

function MediaChoice({ active, icon: Icon, title, description, preview, isVideo, onClick }) {
  return (
    <button
      className={`lock-media-choice${active ? ' is-active' : ''}`}
      type="button"
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="lock-media-preview">
        {isVideo ? (
          <video src={encodeURI(decodeURI(preview))} muted playsInline preload="metadata" />
        ) : (
          <img src={preview} alt="" />
        )}
        <span className="lock-media-icon"><Icon size={18} /></span>
        {active && <span className="lock-media-check"><Check size={14} /></span>}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

export default function LockScreenSettings({
  settings,
  customMediaUrl,
  onChange,
  onChooseCustomMedia,
  onClose,
}) {
  const fileInputRef = useRef(null);
  const [isExitPromptOpen, setIsExitPromptOpen] = useState(false);
  const [exitPassword, setExitPassword] = useState('');
  const [exitError, setExitError] = useState('');
  const [exitDotPulseIndex, setExitDotPulseIndex] = useState(-1);
  const [exitPromptSession, setExitPromptSession] = useState(0);
  const activeMediaUrl = settings.mediaSource === 'custom' && customMediaUrl
    ? customMediaUrl
    : settings.mediaSource === 'new-tvc' && settings.mediaType === 'video'
      ? newTvcVideo
    : settings.mediaType === 'video'
      ? corporateVideo
      : brandAmbassadorImage;

  function resetExitPrompt() {
    setExitPassword('');
    setExitError('');
    setExitDotPulseIndex(-1);
  }

  function openExitPrompt() {
    resetExitPrompt();
    setExitPromptSession((current) => current + 1);
    setIsExitPromptOpen(true);
  }

  function closeExitPrompt() {
    resetExitPrompt();
    setExitPromptSession((current) => current + 1);
    setIsExitPromptOpen(false);
  }

  function attemptExit(password) {
    if (password !== '1234') {
      setExitError('Incorrect password. Please try again.');
      setExitPassword('');
      return;
    }

    if (window.srmb?.exitApp) {
      window.srmb.exitApp();
      return;
    }

    setExitError('Exit is available only in the Electron app.');
  }

  function handleExitSubmit(event) {
    event.preventDefault();
    attemptExit(exitPassword);
  }

  function enterExitKey(key) {
    setExitError('');

    if (key === 'erase') {
      setExitDotPulseIndex(-1);
      setExitPassword((current) => current.slice(0, -1));
      return;
    }

    if (key === 'enter') {
      handleExitSubmit({ preventDefault() {} });
      return;
    }

    if (exitPassword.length >= 4) {
      return;
    }

    setExitDotPulseIndex(exitPassword.length);
    setExitPassword((current) => `${current}${key}`);
  }

  function handleExitKeyDown(event) {
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      enterExitKey(event.key);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      enterExitKey('erase');
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      enterExitKey('enter');
    }
  }

  return (
    <div
      className="website-settings-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="website-settings-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="website-settings-panel">
        <header className="website-settings-header">
          <div className="settings-title-mark"><MonitorPlay size={20} /></div>
          <div>
            <span>SRMB DISPLAY</span>
            <h2 id="website-settings-title">Settings</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close website settings">
            <X size={18} />
          </button>
        </header>

        <div className="website-settings-body">
          <nav className="settings-nav" aria-label="Settings sections">
            <p>DISPLAY</p>
            <button className="is-active" type="button">
              <MonitorPlay size={17} />
              <span>Lock Screen</span>
            </button>
            <button className="settings-exit-nav-button" type="button" onClick={openExitPrompt}>
              <Power size={17} />
              <span>Exit</span>
            </button>
            <small>Changes save automatically on this device.</small>
          </nav>

          <div className="lock-settings-content">
            <div className="lock-settings-heading">
              <div>
                <span>LOCK SCREEN</span>
                <h3>Choose what visitors see when the display is idle.</h3>
              </div>
              <button
                className="preview-lock-button"
                type="button"
                onClick={() => onChange({ previewRequested: Date.now() })}
              >
                Preview lock screen
              </button>
            </div>

            <section className="settings-card lock-system-card">
              <div className="settings-card-title">
                {settings.enabled ? <Lock size={20} /> : <Unlock size={20} />}
                <div>
                  <h4>Lock system</h4>
                  <p>Control whether the lock screen starts automatically when the display is idle.</p>
                </div>
              </div>

              <button
                className={`clock-visibility-toggle lock-system-toggle${settings.enabled ? ' is-on' : ''}`}
                type="button"
                onClick={() => onChange({ enabled: !settings.enabled })}
                aria-pressed={settings.enabled}
              >
                <span>{settings.enabled ? <Lock size={18} /> : <Unlock size={18} />}</span>
                <strong>{settings.enabled ? 'Lock system on' : 'Lock system off'}</strong>
                <i aria-hidden="true"><b /></i>
              </button>
            </section>

            <section className="settings-card">
              <div className="settings-card-title">
                <ImageIcon size={20} />
                <div>
                  <h4>Background media</h4>
                  <p>Show an image or play an SRMB video in the background.</p>
                </div>
              </div>

              <div className="lock-media-grid">
                <MediaChoice
                  active={settings.mediaSource === 'brand' && settings.mediaType === 'image'}
                  icon={ImageIcon}
                  title="Brand ambassador"
                  description="Full-screen image"
                  preview={brandAmbassadorImage}
                  onClick={() => onChange({ mediaType: 'image', mediaSource: 'brand' })}
                />
                <MediaChoice
                  active={settings.mediaSource === 'new-tvc' && settings.mediaType === 'video'}
                  icon={MonitorPlay}
                  title="New TVC"
                  description="SRMB TMT Launch AV"
                  preview={newTvcVideo}
                  isVideo
                  onClick={() => onChange({ mediaType: 'video', mediaSource: 'new-tvc' })}
                />
                <MediaChoice
                  active={settings.mediaSource === 'corporate' && settings.mediaType === 'video'}
                  icon={Video}
                  title="Corporate video"
                  description="Muted video on repeat"
                  preview={corporateVideo}
                  isVideo
                  onClick={() => onChange({ mediaType: 'video', mediaSource: 'corporate' })}
                />
              </div>

              <div className="custom-media-row">
                <div>
                  <Upload size={19} />
                  <span>
                    <strong>Use your own image or video</strong>
                    <small>JPG, PNG, WEBP or MP4</small>
                  </span>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  {settings.mediaSource === 'custom' && customMediaUrl ? 'Change file' : 'Choose file'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onChooseCustomMedia(file);
                    }
                    event.target.value = '';
                  }}
                />
              </div>

              {settings.mediaSource === 'custom' && customMediaUrl && (
                <div className="custom-media-selected">
                  <Check size={16} />
                  Custom {settings.mediaType} selected
                </div>
              )}
            </section>

            <div className="settings-two-column">
              <section className={`settings-card idle-time-card${settings.enabled ? '' : ' is-disabled'}`}>
                <div className="settings-card-title">
                  <TimerReset size={20} />
                  <div>
                    <h4>Start automatically</h4>
                    <p>Open lock screen after no touch for:</p>
                  </div>
                </div>

                <div className="idle-time-control">
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={settings.idleSeconds}
                    onChange={(event) => onChange({ idleSeconds: Number(event.target.value) })}
                    aria-label="Lock screen idle time in seconds"
                    disabled={!settings.enabled}
                  />
                  <label>
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={settings.idleSeconds}
                      disabled={!settings.enabled}
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);
                        if (Number.isFinite(nextValue)) {
                          onChange({ idleSeconds: Math.min(3600, Math.max(10, nextValue)) });
                        }
                      }}
                    />
                    <span>seconds</span>
                  </label>
                </div>

                <div className="idle-presets">
                  {[30, 60, 120, 300].map((seconds) => (
                    <button
                      key={seconds}
                      className={settings.idleSeconds === seconds ? 'is-active' : ''}
                      type="button"
                      onClick={() => onChange({ idleSeconds: seconds })}
                      disabled={!settings.enabled}
                    >
                      {seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settings-card clock-toggle-card">
                <div className="settings-card-title">
                  <Clock3 size={20} />
                  <div>
                    <h4>Clock</h4>
                    <p>Show the time and date over the media.</p>
                  </div>
                </div>

                <button
                  className={`clock-visibility-toggle${settings.showClock ? ' is-on' : ''}`}
                  type="button"
                  onClick={() => onChange({ showClock: !settings.showClock })}
                  aria-pressed={settings.showClock}
                >
                  <span>{settings.showClock ? <Eye size={18} /> : <EyeOff size={18} />}</span>
                  <strong>{settings.showClock ? 'Clock visible' : 'Clock hidden'}</strong>
                  <i aria-hidden="true"><b /></i>
                </button>
              </section>
            </div>

            <section className="settings-card tap-prompt-card">
              <div className="settings-card-title">
                <MousePointerClick size={20} />
                <div>
                  <h4>Tap to start prompt</h4>
                  <p>Show a tap icon and &quot;Tap to start&quot; on the lock screen.</p>
                </div>
              </div>

              <button
                className={`clock-visibility-toggle${settings.showTapPrompt ? ' is-on' : ''}`}
                type="button"
                onClick={() => onChange({ showTapPrompt: !settings.showTapPrompt })}
                aria-pressed={settings.showTapPrompt}
              >
                <span>{settings.showTapPrompt ? <Eye size={18} /> : <EyeOff size={18} />}</span>
                <strong>{settings.showTapPrompt ? 'Prompt visible' : 'Prompt hidden'}</strong>
                <i aria-hidden="true"><b /></i>
              </button>
            </section>

            <section className={`settings-card clock-design-card${settings.showClock ? '' : ' is-disabled'}`}>
              <div className="settings-card-title">
                <Clock3 size={20} />
                <div>
                  <h4>Clock design</h4>
                  <p>Choose a style that works best with your background.</p>
                </div>
              </div>

              <div className="clock-style-grid">
                {clockStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`clock-style-option clock-style-${style.id}${settings.clockStyle === style.id ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => onChange({ clockStyle: style.id })}
                    disabled={!settings.showClock}
                    aria-pressed={settings.clockStyle === style.id}
                  >
                    <span className="clock-style-preview">
                      <strong>{style.time}</strong>
                      <small>FRI, 27 JUNE</small>
                    </span>
                    <span>
                      <strong>{style.label}</strong>
                      <small>{style.detail}</small>
                    </span>
                    {settings.clockStyle === style.id && <Check size={15} />}
                  </button>
                ))}
              </div>
            </section>

            <div className="active-media-summary" aria-live="polite">
              <span>ACTIVE BACKGROUND</span>
              <strong>
                {settings.mediaSource === 'custom'
                  ? `Custom ${settings.mediaType}`
                  : settings.mediaSource === 'new-tvc'
                    ? 'New TVC — SRMB TMT Launch AV'
                  : settings.mediaType === 'video'
                    ? 'Corporate video'
                    : 'Brand ambassador image'}
              </strong>
              <small>{activeMediaUrl ? 'Ready for lock screen' : 'Choose a media file'}</small>
            </div>
          </div>
        </div>
      </section>

      {isExitPromptOpen && (
        <div
          key={exitPromptSession}
          className="exit-password-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-password-title"
          tabIndex={-1}
          onKeyDown={handleExitKeyDown}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeExitPrompt();
            }
          }}
        >
          <form className="exit-password-panel" onSubmit={handleExitSubmit}>
            <button
              className="exit-password-close"
              type="button"
              onClick={closeExitPrompt}
              aria-label="Cancel exit"
            >
              <X size={16} />
            </button>

            <img className="exit-password-logo" src="/assets/applogo/download.png" alt="SRMB" />

            <div className="exit-password-top">
              <h3 id="exit-password-title" className="exit-password-title">Exit code</h3>
              {exitPassword.length > 0 && (
                <div
                  className="exit-code-dots"
                  aria-label={`${exitPassword.length} of 4 password digits entered`}
                >
                  {Array.from({ length: exitPassword.length }).map((_, index) => (
                    <span
                      key={index}
                      className={`is-filled${index === exitDotPulseIndex ? ' is-pulsing' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="exit-password-divider" aria-hidden="true" />

            <div className="exit-keypad" aria-label="Exit password keypad">
              {exitKeypadKeys.map((key) => (
                <button
                  key={key}
                  className={`exit-keypad-button${key === 'erase' || key === 'enter' ? ' is-action' : ''}`}
                  type="button"
                  onClick={() => enterExitKey(key)}
                  aria-label={key === 'erase' ? 'Erase last digit' : key === 'enter' ? 'Submit code' : `Enter ${key}`}
                >
                  {key === 'erase' ? 'Erase' : key === 'enter' ? 'Enter' : key}
                </button>
              ))}
            </div>

            {exitError && <p className="exit-password-error">{exitError}</p>}
            <button className="exit-password-submit" type="submit">Exit app</button>
          </form>
        </div>
      )}
    </div>
  );
}
