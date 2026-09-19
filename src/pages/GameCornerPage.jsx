import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/pages/GameCornerPage.css';
import '../styles/kiosk-overrides.css';
import { flushSync } from 'react-dom';
import { ArrowLeft, Building2, Check, Clapperboard, ExternalLink, Factory, Gamepad2, Hammer, Landmark, Map, Mic2, Newspaper, Play, RotateCcw, ShieldCheck, Sun, Trophy, X, Zap } from 'lucide-react';
import { sections, cards, formatHomeDateTime, formatHomeDate, formatDigitalTime, formatLongDate, formatMonthTitle, toCalendarKey, calendarEvents, getCalendarMonthData, formatMediaTime, infrastructureVideo, corporateVideo, brandAmbassadorImage, corporateOfficeMapsUrl, corporateOfficeEmbedUrl, themes, themeIds, defaultTheme, aboutPhotos, boardDirectorSlides, navItems, contactDetails, galleryVideos, testimonyAssetPath, testimonyPosterPath, testimonyVideos, testimonyVideosPerSlide, productBrochurePage, productBrochurePages, productSlides, realnailSlides, projectSlides, certificateSlides, awardSlides, mediaAssetPath, mediaPosterPath, mediaCornerSections, sectionDetails, feedbackRatings, feedbackMoodOptions } from '../data/appData.jsx';
import { GoogleMapsIcon, PrimaryNav } from '../components/shared.jsx';

// Static difficulty and product data used by the educational mini-games.
const steelSurvivorBars = [
  {
    id: 'generic',
    label: 'Generic Low Grade',
    tag: 'Unverified Bar',
    strength: 58,
    flex: 42,
    detail: 'Lower ductility and weak bond make the frame crack under heavy vibration.',
  },
  {
    id: 'srmb',
    label: 'SRMB Fe 500D',
    tag: 'Seismic Grade',
    strength: 98,
    flex: 94,
    detail: 'SRMB Fe 500D ribs, elongation and controlled rolling help the frame flex and hold.',
  },
];

const steelSurvivorQuakes = [
  { id: 'medium', label: 'Zone IV Tremor', magnitude: '6.4', force: 64 },
  { id: 'high', label: 'Zone V Shock', magnitude: '7.2', force: 78 },
  { id: 'extreme', label: 'Peak Stress Pulse', magnitude: '8.0', force: 88 },
];

const buildKolkataEras = [
  {
    id: '1970s',
    title: '1970s Kolkata',
    brief: 'Rebuild bridges and dependable civic links for a growing city.',
    site: 'Bridge Corridor',
    correctProduct: 'tmt-bars',
    milestone: 'SRMB begins its legacy of strength, serving Bengal with dependable steel.',
  },
  {
    id: '1990s',
    title: '1990s Expansion',
    brief: 'Add housing blocks and taller RCC structures for the expanding city.',
    site: 'Housing Complex',
    correctProduct: 'tmt-bars',
    milestone: 'Higher capacity, wider reach, and stronger trust across construction markets.',
  },
  {
    id: '2010s',
    title: '2010s Industry',
    brief: 'Build industrial sheds and modern facilities around Kolkata.',
    site: 'Industrial Shed',
    correctProduct: 'hollow-sections',
    milestone: 'SRMB product portfolio grows with structural steel, wire and fabrication solutions.',
  },
  {
    id: 'today',
    title: 'Kolkata Tomorrow',
    brief: 'Complete a smart city district with transport, homes and clean infrastructure.',
    site: 'Smart City District',
    correctProduct: 'real-fabrica',
    milestone: 'The SRMB Kolkata of Tomorrow shines through certified quality and civic pride.',
  },
];

const buildKolkataProducts = [
  {
    id: 'tmt-bars',
    label: 'SRMB TMT Bars',
    icon: Landmark,
    use: 'RCC columns, bridges, homes',
    points: 30,
  },
  {
    id: 'hollow-sections',
    label: 'Hollow Sections',
    icon: Factory,
    use: 'Industrial sheds and steel frames',
    points: 26,
  },
  {
    id: 'real-fabrica',
    label: 'RealFabrica',
    icon: Building2,
    use: 'Modern fabricated structures',
    points: 34,
  },
];

const millRushStations = [
  {
    id: 'billet',
    title: 'Billet Heating',
    short: 'Heat',
    task: 'Tap the furnace button to heat the raw billet.',
    fact: 'Billets are heated evenly before rolling so the steel can be shaped without internal stress.',
  },
  {
    id: 'rolling',
    title: 'Rolling Mill',
    short: 'Roll',
    task: 'Choose the correct rolling speed for uniform ribs.',
    fact: 'Controlled rolling creates the rib pattern that helps TMT bars grip concrete strongly.',
  },
  {
    id: 'thermex',
    title: 'Thermex Quenching',
    short: 'Quench',
    task: 'Set the water temperature zone for the Thermex process.',
    fact: 'The Thermex process gives SRMB TMT bars a hardened outer rim with a soft, ductile core.',
  },
  {
    id: 'cooling',
    title: 'Cooling Bed QC',
    short: 'QC',
    task: 'Catch the defective bar before it passes quality check.',
    fact: 'Quality checks help remove cracked, bent or visually defective bars before dispatch.',
  },
  {
    id: 'bundle',
    title: 'Bundle & Dispatch',
    short: 'Bundle',
    task: 'Swipe right across the bundle zone to dispatch the finished bars.',
    fact: 'Finished TMT bars are bundled, tagged and dispatched with traceable batch information.',
  },
];

const productMatchProducts = [
  {
    id: 'tmt-bars',
    label: 'SRMB TMT Bars',
    short: 'TMT',
    fact: 'SRMB TMT bars are ideal for RCC strength in homes, high-rises and bridges.',
  },
  {
    id: 'hollow-sections',
    label: 'Hollow Sections',
    short: 'Hollow',
    fact: 'SRMB Hollow Sections give superior strength-to-weight ratio for industrial and architectural frames.',
  },
  {
    id: 'angles-flats',
    label: 'Angles & Flats',
    short: 'Angles',
    fact: 'Angles and flats are dependable choices for gates, frames, brackets and fabrication work.',
  },
  {
    id: 'binding-wire',
    label: 'Binding Wire',
    short: 'Wire',
    fact: 'Binding wire keeps reinforcement cages aligned before concrete is poured.',
  },
  {
    id: 'stirrups',
    label: 'Stirrups',
    short: 'Stirrups',
    fact: 'Stirrups hold longitudinal bars together and improve shear resistance in beams and columns.',
  },
  {
    id: 'z-angles',
    label: 'Z-Angles',
    short: 'Z-Angle',
    fact: 'Z-angles work well for railing, support and light structural fabrication details.',
  },
];

const productMatchScenes = [
  {
    id: 'house',
    title: 'House RCC Frame',
    productId: 'tmt-bars',
    icon: Building2,
    hint: 'A home RCC frame needs SRMB TMT Bars.',
  },
  {
    id: 'factory',
    title: 'Factory Shed',
    productId: 'hollow-sections',
    icon: Factory,
    hint: 'A factory shed needs Hollow Sections for light, strong framing.',
  },
  {
    id: 'gate',
    title: 'Main Gate',
    productId: 'angles-flats',
    icon: Landmark,
    hint: 'Gate fabrication is best matched with Angles & Flats.',
  },
  {
    id: 'wall',
    title: 'Compound Wall',
    productId: 'binding-wire',
    icon: Hammer,
    hint: 'A compound wall rebar cage needs Binding Wire.',
  },
  {
    id: 'highrise',
    title: 'High-Rise Column',
    productId: 'stirrups',
    icon: Building2,
    hint: 'A high-rise column cage needs Stirrups.',
  },
  {
    id: 'bridge',
    title: 'Bridge Railing',
    productId: 'z-angles',
    icon: Landmark,
    hint: 'Bridge railing support details match with Z-Angles.',
  },
];

const spotFakeClues = [
  {
    id: 'marking',
    label: 'BIS / ISI Mark',
    safe: 'Correct ISI + IS:1786 mark',
    defect: 'Wrong B1S marking',
  },
  {
    id: 'rib',
    label: 'Rib Spacing',
    safe: 'Uniform rib spacing',
    defect: 'Ribs too wide',
  },
  {
    id: 'surface',
    label: 'Surface Crack',
    safe: 'Clean rolled surface',
    defect: 'Hairline crack visible',
  },
  {
    id: 'heat',
    label: 'Heat Number',
    safe: 'Mill heat number present',
    defect: 'Heat number missing',
  },
];

const spotFakeSamples = [
  {
    id: 'srmb',
    label: 'Sample A',
    name: 'SRMB Fe 500D',
    stamp: 'ISI IS:1786',
    heat: 'HEAT SRMB-KOL-500D',
    image: '/assets/game/srmb-fe500d-original.png',
    quality: 96,
    isFake: false,
    findings: {
      marking: 'Genuine BIS/ISI mark is stamped cleanly.',
      rib: 'Ribs are close, even and made for strong concrete grip.',
      surface: 'Surface is clean with no crack or peeling.',
      heat: 'Mill heat number is traceable and easy to read.',
    },
  },
  {
    id: 'fake',
    label: 'Sample B',
    name: 'Counterfeit Bar',
    stamp: 'B1S MARK',
    heat: 'NO HEAT NO.',
    quality: 34,
    isFake: true,
    findings: {
      marking: 'Fake B1S-style marking is not a valid BIS/ISI stamp.',
      rib: 'Ribs are too far apart, reducing grip inside concrete.',
      surface: 'Surface crack can weaken the bar under stress.',
      heat: 'No heat number means the product cannot be traced.',
    },
  },
];

// Game menu that switches between mini-games without changing the app route.
export default function GameCornerPage({ onNavigate }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'steel-survivor') {
    return <SteelSurvivorGame onBack={() => setActiveGame(null)} onNavigate={onNavigate} />;
  }

  if (activeGame === 'build-kolkata') {
    return <BuildKolkataGame onBack={() => setActiveGame(null)} onNavigate={onNavigate} />;
  }

  if (activeGame === 'mill-rush') {
    return <SteelMillRushGame onBack={() => setActiveGame(null)} onNavigate={onNavigate} />;
  }

  if (activeGame === 'spot-fake') {
    return <SpotFakeGame onBack={() => setActiveGame(null)} onNavigate={onNavigate} />;
  }

  if (activeGame === 'product-match') {
    return <ProductMatchGame onBack={() => setActiveGame(null)} onNavigate={onNavigate} />;
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className="about-panel game-panel">
        <header className="about-header">
          <div className="about-title-bar">
            <h1>GAME CORNER</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="game-menu-stage" aria-label="SRMB game choices">
          <article className="game-menu-copy">
            <span className="game-kicker">Choose Your Challenge</span>
            <h2>Play. Test. Build Strong.</h2>
            <p>Interactive SRMB learning games for students, homeowners, architects and experience centre visitors.</p>
          </article>

          <button
            className="game-choice-card active"
            type="button"
            onClick={() => setActiveGame('steel-survivor')}
            aria-label="Start Steel Survivor earthquake challenge"
          >
            <span className="game-choice-top">
              <Gamepad2 aria-hidden="true" />
              <span>Game 1</span>
            </span>
            <strong>Steel Survivor</strong>
            <span>The Earthquake Challenge</span>
            <span className="game-choice-art" aria-hidden="true">
              <span className="mini-city">
                <i />
                <i />
                <i />
              </span>
              <Zap />
            </span>
            <span className="game-choice-cta">Tap to Play</span>
          </button>

          <button
            className="game-choice-card mill-rush-choice"
            type="button"
            onClick={() => setActiveGame('mill-rush')}
            aria-label="Start Steel Mill Rush factory floor simulator"
          >
            <span className="game-choice-top">
              <Factory aria-hidden="true" />
              <span>Game 2</span>
            </span>
            <strong>Steel Mill Rush</strong>
            <span>Factory Floor Simulator</span>
            <span className="game-choice-art mill-rush-choice-art" aria-hidden="true">
              <span className="mini-mill-line">
                <i />
                <i />
                <i />
                <em />
              </span>
              <Factory />
            </span>
            <span className="game-choice-cta">Start Rush</span>
          </button>

          <button
            className="game-choice-card build-kolkata-choice"
            type="button"
            onClick={() => setActiveGame('build-kolkata')}
            aria-label="Start Build Kolkata legacy constructor"
          >
            <span className="game-choice-top">
              <Map aria-hidden="true" />
              <span>Game 3</span>
            </span>
            <strong>Build Kolkata</strong>
            <span>The Legacy Constructor</span>
            <span className="game-choice-art kolkata-choice-art" aria-hidden="true">
              <span className="mini-kolkata-map">
                <i />
                <i />
                <i />
                <i />
              </span>
              <Trophy />
            </span>
            <span className="game-choice-cta">Start Building</span>
          </button>

          <button
            className="game-choice-card detective-choice"
            type="button"
            onClick={() => setActiveGame('spot-fake')}
            aria-label="Start Spot the Fake steel detective game"
          >
            <span className="game-choice-top">
              <ShieldCheck aria-hidden="true" />
              <span>Game 4</span>
            </span>
            <strong>Spot the Fake</strong>
            <span>The Steel Detective</span>
            <span className="game-choice-art detective-choice-art" aria-hidden="true">
              <span className="mini-lab-bars">
                <i />
                <i />
                <em />
              </span>
              <ShieldCheck />
            </span>
            <span className="game-choice-cta">Start Case</span>
          </button>

          <button
            className="game-choice-card product-match-choice"
            type="button"
            onClick={() => setActiveGame('product-match')}
            aria-label="Start The Right Steel for the Right Job product match challenge"
          >
            <span className="game-choice-top">
              <Hammer aria-hidden="true" />
              <span>Game 5</span>
            </span>
            <strong>Right Steel</strong>
            <span>Product Match Challenge</span>
            <span className="game-choice-art product-match-choice-art" aria-hidden="true">
              <span className="mini-match-grid">
                <i />
                <i />
                <i />
                <em />
              </span>
              <Check />
            </span>
            <span className="game-choice-cta">Match Products</span>
          </button>
        </section>

        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}

function GameBackButton({ onBack }) {
  return (
    <button className="game-back-button" type="button" onClick={onBack} aria-label="Back to games">
      <ArrowLeft aria-hidden="true" />
    </button>
  );
}

// Product matching game where users connect SRMB products with real-world applications.
function ProductMatchGame({ onBack, onNavigate }) {
  const [selectedProductId, setSelectedProductId] = useState(productMatchProducts[0].id);
  const [matches, setMatches] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastMessage, setLastMessage] = useState('Tap Start Match, then drag or tap products into the right construction scene.');
  const [lastMatchedProductId, setLastMatchedProductId] = useState(productMatchProducts[0].id);
  const matchedCount = Object.keys(matches).length;
  const isComplete = matchedCount === productMatchScenes.length || (isPlaying && timeLeft === 0);
  const selectedProduct = productMatchProducts.find((product) => product.id === selectedProductId) || productMatchProducts[0];
  const lastMatchedProduct = productMatchProducts.find((product) => product.id === lastMatchedProductId) || selectedProduct;
  const productIqScore = !isPlaying && matchedCount === 0 && timeLeft === 75
    ? 0
    : Math.max(0, Math.min(100, (matchedCount * 14) + Math.floor(timeLeft / 5) - (wrongAttempts * 3)));

  useEffect(() => {
    if (!isPlaying || isComplete) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, isComplete]);

  useEffect(() => {
    if (matchedCount === productMatchScenes.length && isPlaying) {
      setIsPlaying(false);
      setLastMessage('All products matched. Product IQ Score is ready.');
    }
  }, [matchedCount, isPlaying]);

  useEffect(() => {
    if (isPlaying && timeLeft === 0 && matchedCount < productMatchScenes.length) {
      setLastMessage('Time up. Press Restart and try to beat your Product IQ Score.');
    }
  }, [isPlaying, matchedCount, timeLeft]);

  function startMatchGame() {
    setSelectedProductId(productMatchProducts[0].id);
    setLastMatchedProductId(productMatchProducts[0].id);
    setMatches({});
    setWrongAttempts(0);
    setTimeLeft(75);
    setIsPlaying(true);
    setLastMessage('Game started. Match each product to its correct application.');
  }

  function handleProductDrop(sceneId, productId = selectedProductId) {
    if (!isPlaying || timeLeft === 0 || matches[sceneId]) {
      return;
    }

    const scene = productMatchScenes.find((item) => item.id === sceneId);
    const product = productMatchProducts.find((item) => item.id === productId);

    if (!scene || !product) {
      return;
    }

    if (scene.productId === product.id) {
      setMatches((current) => ({ ...current, [scene.id]: product.id }));
      setLastMatchedProductId(product.id);
      setLastMessage(`${product.label} snapped into ${scene.title}.`);
      return;
    }

    setWrongAttempts((current) => current + 1);
    setLastMessage(scene.hint);
  }

  function handleDragStart(event, productId) {
    setSelectedProductId(productId);
    event.dataTransfer.setData('text/plain', productId);
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className={`about-panel game-panel product-match-panel ${isPlaying ? 'playing' : ''} ${matchedCount === productMatchScenes.length ? 'complete' : ''}`}>
        <header className="about-header">
          <div className="about-title-bar">
            <h1>RIGHT STEEL RIGHT JOB</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="product-match-stage" aria-label="Right steel for the right job product match challenge">
          <aside className="match-product-panel">
            <div className="match-brief-card">
              <span className="game-kicker">Product Shelf</span>
              <h2>Drag or tap a product</h2>
              <p>Select a product, then tap the matching construction scene. On desktop, you can drag it directly.</p>
            </div>

            <div className="match-product-list" aria-label="SRMB products">
              {productMatchProducts.map((product) => {
                const isMatched = Object.values(matches).includes(product.id);
                return (
                  <button
                    key={product.id}
                    className={`${selectedProductId === product.id ? 'active' : ''} ${isMatched ? 'matched' : ''}`}
                    type="button"
                    draggable={!isMatched}
                    disabled={isMatched}
                    onClick={() => setSelectedProductId(product.id)}
                    onDragStart={(event) => handleDragStart(event, product.id)}
                  >
                    <span>{product.short}</span>
                    <strong>{product.label}</strong>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="match-board-panel">
            <div className="match-hud">
              <span>Timer</span>
              <strong>{String(timeLeft).padStart(2, '0')}s</strong>
              <span>{matchedCount}/{productMatchScenes.length} matched</span>
            </div>

            <div className="match-scene-grid" aria-label="Construction scenes">
              {productMatchScenes.map((scene) => {
                const matchedProductId = matches[scene.id];
                const matchedProduct = productMatchProducts.find((product) => product.id === matchedProductId);
                const SceneIcon = scene.icon;

                return (
                  <button
                    key={scene.id}
                    className={`match-scene-card scene-${scene.id} ${matchedProduct ? 'matched' : ''}`}
                    type="button"
                    onClick={() => handleProductDrop(scene.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleProductDrop(scene.id, event.dataTransfer.getData('text/plain'));
                    }}
                  >
                    <span className="match-scene-icon">
                      <SceneIcon aria-hidden="true" />
                    </span>
                    <strong>{scene.title}</strong>
                    <span className="match-drop-label">
                      {matchedProduct ? matchedProduct.label : 'Drop product here'}
                    </span>
                    <span className="match-scene-glow" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="match-score-panel">
            <div className="match-score-card">
              <span>Product IQ Score</span>
              <strong>{productIqScore}</strong>
              <small>{matchedCount}/{productMatchScenes.length} correct</small>
            </div>

            <button className="match-start-button" type="button" onClick={startMatchGame}>
              {isPlaying ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
              {isPlaying ? 'Restart' : 'Start Match'}
            </button>

            <div className="match-message-card">
              <span className="game-kicker">{matchedCount === productMatchScenes.length ? 'Complete' : wrongAttempts ? 'Hint' : 'Status'}</span>
              <p>{lastMessage}</p>
            </div>

            <div className="match-fact-card">
              <Check aria-hidden="true" />
              <h2>Product Fact</h2>
              <p>{lastMatchedProduct.fact}</p>
            </div>
          </aside>
        </section>

        <GameBackButton onBack={onBack} />
        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}

// Simulates earthquake resistance using the selected steel grade.
function SteelSurvivorGame({ onBack, onNavigate }) {
  const [selectedBarId, setSelectedBarId] = useState('generic');
  const [quakeIndex, setQuakeIndex] = useState(1);
  const [testState, setTestState] = useState('idle');
  const [round, setRound] = useState(1);
  const selectedBar = steelSurvivorBars.find((bar) => bar.id === selectedBarId) || steelSurvivorBars[0];
  const activeQuake = steelSurvivorQuakes[quakeIndex];
  const score = Math.round((selectedBar.strength * 0.58) + (selectedBar.flex * 0.42) - activeQuake.force * 0.42);
  const survived = score >= 48;
  const resultTitle = survived ? 'SRMB Frame Survived' : 'Structure Failed';
  const resultCopy = survived
    ? 'SRMB TMT bars flex, grip concrete and hold the frame through the simulated quake.'
    : 'The low-grade bars crack under stress. Choose SRMB seismic grade TMT to build stronger.';

  useEffect(() => {
    if (testState !== 'shaking') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTestState('result');
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [testState, round]);

  function runTest() {
    setRound((current) => current + 1);
    setTestState('shaking');
  }

  function resetTest() {
    setTestState('idle');
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className={`about-panel game-panel steel-survivor-panel selected-${selectedBarId} ${testState} ${survived ? 'survived' : 'failed'}`}>
        <header className="about-header">
          <div className="about-title-bar">
            <h1>STEEL SURVIVOR</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="steel-game-stage" aria-label="Steel Survivor earthquake challenge">
          <aside className="steel-control-panel">
            <div className="steel-control-block">
              <span className="game-kicker">Select TMT Bars</span>
              <div className="bar-shelf">
                {steelSurvivorBars.map((bar) => (
                  <button
                    key={bar.id}
                    className={selectedBarId === bar.id ? 'active' : ''}
                    type="button"
                    onClick={() => {
                      setSelectedBarId(bar.id);
                      resetTest();
                    }}
                  >
                    <span className={`bar-icon bar-icon-${bar.id}`} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      {bar.id === 'srmb' && <em>SRMB</em>}
                    </span>
                    <strong>{bar.label}</strong>
                    <span>{bar.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="steel-control-block">
              <span className="game-kicker">Earthquake Level</span>
              <div className="quake-selector">
                {steelSurvivorQuakes.map((quake, index) => (
                  <button
                    key={quake.id}
                    className={quakeIndex === index ? 'active' : ''}
                    type="button"
                    onClick={() => {
                      setQuakeIndex(index);
                      resetTest();
                    }}
                  >
                    <Zap aria-hidden="true" />
                    <span>{quake.label}</span>
                    <strong>M {quake.magnitude}</strong>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <article className="quake-arena" aria-live="polite">
            <div className="arena-hud">
              <span>Round {round}</span>
              <strong>{activeQuake.label}</strong>
              <span>Magnitude {activeQuake.magnitude}</span>
            </div>

            <div className="city-scene" aria-hidden="true">
              <div className="real-clouds">
                <span />
                <span />
                <span />
              </div>
              <div className="sun-core" />
              <div className="distant-hills" />
              <div className="tree-line">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="road-layer">
                <span />
                <span />
              </div>
              <div className="street-light">
                <span />
                <span />
                <span />
              </div>
              <div className="skyline back">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="test-building">
                <div className="building-side" />
                <div className="roof-beam">
                  <span>SRMB</span>
                </div>
                {[0, 1, 2, 3].map((floor) => (
                  <div className="building-floor" key={floor}>
                    <span className="slab-edge" />
                    <span className="window-bay" />
                    <span className="window-bay" />
                    <span className="window-bay" />
                    <span className="cross-brace" />
                  </div>
                ))}
                <div className="rebar-column left" />
                <div className="rebar-column middle" />
                <div className="rebar-column right" />
                <div className="building-foundation" />
                <div className="survival-glow" />
                <div className="crack crack-one" />
                <div className="crack crack-two" />
              </div>
              <div className="rubble-field">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="dust-cloud dust-left" />
              <div className="dust-cloud dust-right" />
              <div className="quake-wave wave-one" />
              <div className="quake-wave wave-two" />
              <div className="ground-line" />
            </div>

            <div className="arena-actions">
              <button className="test-button" type="button" onClick={runTest} disabled={testState === 'shaking'}>
                <Hammer aria-hidden="true" />
                {testState === 'shaking' ? 'Testing...' : 'Test It'}
              </button>
              <button className="reset-button" type="button" onClick={resetTest}>
                <RotateCcw aria-hidden="true" />
                Reset
              </button>
            </div>
          </article>

          <aside className="steel-result-panel">
            <div className="score-dial">
              <span>Survival Score</span>
              <strong>{Math.max(score, 0)}</strong>
              <small>/100</small>
            </div>

            <div className="result-card">
              <ShieldCheck aria-hidden="true" />
              <h2>{testState === 'result' ? resultTitle : 'Ready for Stress Test'}</h2>
              <p>{testState === 'result' ? resultCopy : selectedBar.detail}</p>
            </div>

            <div className="learning-card">
              <span>Did You Know?</span>
              <p>SRMB TMT bars meet IS:1786 standards and are designed for seismic Zone IV and V resistance.</p>
            </div>
          </aside>
        </section>

        <GameBackButton onBack={onBack} />
        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}

// Factory-floor tap/swipe game that walks through the TMT manufacturing flow.
function SteelMillRushGame({ onBack, onNavigate }) {
  const [stationIndex, setStationIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [status, setStatus] = useState('Tap Start Rush to run the plant.');
  const bundleSwipeStart = useRef(null);
  const activeStation = millRushStations[stationIndex];
  const progress = Math.round((stationIndex / millRushStations.length) * 100);
  const qualityScore = Math.min(100, score + Math.max(0, timeLeft));

  useEffect(() => {
    if (!isRunning || isComplete) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          setStatus('Time up. Restart the line and try for a higher Batch Quality Score.');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, isComplete]);

  function startRush() {
    setStationIndex(0);
    setScore(0);
    setTimeLeft(60);
    setIsRunning(true);
    setIsComplete(false);
    setStatus('Line started. Clear each station before the timer runs out.');
  }

  function finishStation(points, message) {
    if (!isRunning || isComplete) {
      return;
    }

    setScore((current) => Math.min(100, current + points));
    setStatus(message);

    if (stationIndex >= millRushStations.length - 1) {
      setIsRunning(false);
      setIsComplete(true);
      return;
    }

    setStationIndex((current) => current + 1);
  }

  function handleChoice(isCorrect, successMessage, warningMessage) {
    finishStation(isCorrect ? 18 : 7, isCorrect ? successMessage : warningMessage);
  }

  function startBundleSwipe(event) {
    if (!isRunning || activeStation.id !== 'bundle') {
      return;
    }

    bundleSwipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function finishBundleSwipe(event) {
    if (!bundleSwipeStart.current || activeStation.id !== 'bundle') {
      return;
    }

    const deltaX = event.clientX - bundleSwipeStart.current.x;
    const deltaY = event.clientY - bundleSwipeStart.current.y;
    bundleSwipeStart.current = null;

    if (deltaX > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      finishStation(20, 'Bundle dispatched. Batch complete with traceable SRMB quality.');
    } else {
      setStatus('Swipe right across the bundle zone to dispatch the finished bars.');
    }
  }

  function renderStationChallenge() {
    if (isComplete) {
      return (
        <button className="mill-start-button" type="button" onClick={startRush}>
          <RotateCcw aria-hidden="true" />
          Run Again
        </button>
      );
    }

    if (!isRunning) {
      return (
        <button className="mill-start-button" type="button" onClick={startRush}>
          <Play aria-hidden="true" />
          Start Rush
        </button>
      );
    }

    if (activeStation.id === 'billet') {
      return (
        <button className="mill-action-button heat" type="button" onClick={() => finishStation(18, 'Billet heated evenly. Move to rolling mill.')}>
          <Zap aria-hidden="true" />
          Heat Billet
        </button>
      );
    }

    if (activeStation.id === 'rolling') {
      return (
        <div className="mill-choice-grid">
          <button type="button" onClick={() => handleChoice(false, '', 'Too slow. Rib formation becomes uneven.')}>Slow Roll</button>
          <button type="button" onClick={() => handleChoice(true, 'Perfect rolling speed. Uniform ribs formed.', '')}>Perfect Roll</button>
          <button type="button" onClick={() => handleChoice(false, '', 'Too fast. Surface finish loses consistency.')}>Fast Roll</button>
        </div>
      );
    }

    if (activeStation.id === 'thermex') {
      return (
        <div className="mill-choice-grid temp-grid">
          {[650, 720, 840].map((temperature) => (
            <button
              key={temperature}
              type="button"
              onClick={() => handleChoice(
                temperature === 720,
                'Thermex zone balanced. Hard rim, ductile core achieved.',
                `${temperature}C is not ideal. Keep the quench controlled.`
              )}
            >
              {temperature}C
            </button>
          ))}
        </div>
      );
    }

    if (activeStation.id === 'cooling') {
      return (
        <div className="mill-choice-grid defect-grid">
          <button type="button" onClick={() => handleChoice(false, '', 'That bar is clean. Keep scanning for the defective one.')}>Bar A: Clean</button>
          <button type="button" onClick={() => handleChoice(true, 'Defective bar caught before QC passed.', '')}>Bar B: Crack</button>
          <button type="button" onClick={() => handleChoice(false, '', 'That bar is straight. The cracked bar is still moving.')}>Bar C: Clean</button>
        </div>
      );
    }

    return (
      <div
        className="mill-swipe-zone"
        onPointerDown={startBundleSwipe}
        onPointerUp={finishBundleSwipe}
        onPointerCancel={() => {
          bundleSwipeStart.current = null;
        }}
      >
        <span>Swipe Right to Bundle</span>
        <i />
      </div>
    );
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className={`about-panel game-panel mill-rush-panel ${isRunning ? 'running' : ''} ${isComplete ? 'complete' : ''}`}>
        <header className="about-header">
          <div className="about-title-bar">
            <h1>STEEL MILL RUSH</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="mill-rush-stage" aria-label="Steel Mill Rush factory floor simulator">
          <aside className="mill-side-panel">
            <div className="mill-brief-card">
              <span className="game-kicker">Factory Mission</span>
              <h2>Run billet to finished TMT bar</h2>
              <p>Clear each station quickly. Speed and accuracy improve your Batch Quality Score.</p>
            </div>

            <div className="mill-station-list" aria-label="Steel mill stations">
              {millRushStations.map((station, index) => (
                <button
                  key={station.id}
                  className={`${index === stationIndex ? 'active' : ''} ${index < stationIndex || isComplete ? 'done' : ''}`}
                  type="button"
                  disabled
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{station.short}</strong>
                </button>
              ))}
            </div>
          </aside>

          <article className="mill-floor-panel">
            <div className="mill-hud">
              <span>Countdown</span>
              <strong>{String(timeLeft).padStart(2, '0')}s</strong>
              <span>{activeStation.title}</span>
            </div>

            <div className={`mill-floor-scene station-${activeStation.id}`} aria-hidden="true">
              <div className="mill-conveyor">
                <span />
                <span />
                <span />
              </div>
              <div className="mill-furnace">
                <i />
                <strong>Heating</strong>
              </div>
              <div className="mill-rollers">
                <i />
                <i />
                <strong>Rolling</strong>
              </div>
              <div className="mill-quench">
                <i />
                <strong>Thermex</strong>
              </div>
              <div className="mill-cooling">
                <i />
                <i />
                <i />
                <strong>QC</strong>
              </div>
              <div className="mill-bundle">
                <i />
                <i />
                <i />
                <strong>Dispatch</strong>
              </div>
              <div className="mill-billet">
                <i />
                <i />
                <i />
              </div>
            </div>

            <div className="mill-challenge-card">
              <span className="game-kicker">Current Challenge</span>
              <h2>{isComplete ? 'Batch Complete' : activeStation.title}</h2>
              <p>{isComplete ? 'Review the score, then run again to beat SRMB quality benchmark.' : activeStation.task}</p>
              {renderStationChallenge()}
            </div>
          </article>

          <aside className="mill-score-panel">
            <div className="mill-score-card">
              <span>Batch Quality Score</span>
              <strong>{qualityScore}</strong>
              <small>SRMB Benchmark: 90+</small>
            </div>

            <div className="mill-progress-card">
              <span className="game-kicker">Line Progress</span>
              <div className="mill-progress-track">
                <i style={{ width: `${isComplete ? 100 : progress}%` }} />
              </div>
              <p>{isComplete ? 'Finished bars are ready for dispatch.' : status}</p>
            </div>

            <div className="mill-fact-card">
              <Factory aria-hidden="true" />
              <h2>Learning Moment</h2>
              <p>{activeStation.fact}</p>
            </div>

            <button className="reset-city-button mill-reset-button" type="button" onClick={startRush}>
              <RotateCcw aria-hidden="true" />
              Reset Rush
            </button>
          </aside>
        </section>

        <GameBackButton onBack={onBack} />
        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}

// Construction game where players select suitable products for each city project.
function BuildKolkataGame({ onBack, onNavigate }) {
  const [eraIndex, setEraIndex] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(buildKolkataProducts[0].id);
  const [builtEras, setBuiltEras] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const activeEra = buildKolkataEras[eraIndex];
  const selectedProduct = buildKolkataProducts.find((product) => product.id === selectedProductId) || buildKolkataProducts[0];
  const correctProduct = buildKolkataProducts.find((product) => product.id === activeEra.correctProduct) || buildKolkataProducts[0];
  const completedCount = builtEras.length;
  const totalScore = builtEras.reduce((sum, item) => sum + item.score, 0);
  const isComplete = completedCount === buildKolkataEras.length;
  const unlockedEraIndex = Math.min(completedCount, buildKolkataEras.length - 1);
  const buildQuality = Math.round((completedCount / buildKolkataEras.length) * 100);
  const activeEraBuilt = builtEras.some((item) => item.eraId === activeEra.id);
  const isFinalEra = eraIndex === buildKolkataEras.length - 1;
  const buildButtonLabel = activeEraBuilt && !isFinalEra ? 'Next Era' : isComplete && activeEraBuilt ? 'City Complete' : 'Build Now';

  function goToEra(index) {
    setEraIndex(index);
    setLastResult(null);
    setSelectedProductId(buildKolkataProducts[0].id);
  }

  function selectEra(index) {
    const eraBuilt = builtEras.some((item) => item.eraId === buildKolkataEras[index].id);
    if (index > unlockedEraIndex && !eraBuilt) {
      return;
    }

    goToEra(index);
  }

  function handleBuildAction() {
    if (activeEraBuilt && !isFinalEra) {
      goToEra(eraIndex + 1);
      return;
    }

    buildEra();
  }

  function buildEra() {
    const isCorrect = selectedProductId === activeEra.correctProduct;
    const alreadyBuilt = builtEras.some((item) => item.eraId === activeEra.id);
    const score = isCorrect ? selectedProduct.points : 0;
    const result = {
      eraId: activeEra.id,
      productId: selectedProduct.id,
      score,
      isCorrect,
    };

    if (isCorrect && !alreadyBuilt) {
      setBuiltEras((current) => [...current, result].sort((a, b) => (
        buildKolkataEras.findIndex((era) => era.id === a.eraId) - buildKolkataEras.findIndex((era) => era.id === b.eraId)
      )));
    }

    setLastResult({
      type: isCorrect ? 'success' : 'warning',
      title: isCorrect ? (alreadyBuilt ? 'Already Built' : 'Era Upgraded') : 'Wrong Material',
      message: isCorrect
        ? activeEra.milestone
        : `${correctProduct.label} is the right choice for ${activeEra.site}. Pick it and build again.`,
    });
  }

  function resetCity() {
    setEraIndex(0);
    setSelectedProductId(buildKolkataProducts[0].id);
    setBuiltEras([]);
    setLastResult(null);
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className={`about-panel game-panel build-kolkata-panel ${isComplete ? 'complete' : ''}`}>
        <header className="about-header">
          <div className="about-title-bar">
            <h1>BUILD KOLKATA</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="kolkata-game-stage" aria-label="Build Kolkata legacy constructor">
          <aside className="kolkata-mission-panel">
            <div className="kolkata-mission-card">
              <span className="game-kicker">Current Mission</span>
              <h2>{activeEra.site}</h2>
              <p>{activeEra.brief}</p>
              <div className="kolkata-flow-strip" aria-label="Game steps">
                <span className="active">1 Pick</span>
                <span>2 Build</span>
                <span>3 Unlock</span>
              </div>
            </div>

            <div className="kolkata-era-list" aria-label="Kolkata eras">
              <span className="game-kicker">City Timeline</span>
              {buildKolkataEras.map((era, index) => {
                const built = builtEras.some((item) => item.eraId === era.id);
                const locked = index > unlockedEraIndex && !built;
                return (
                  <button
                    key={era.id}
                    className={`${eraIndex === index ? 'active' : ''} ${built ? 'built' : ''} ${locked ? 'locked' : ''}`}
                    type="button"
                    disabled={locked}
                    onClick={() => selectEra(index)}
                  >
                    <span>{built ? 'Built' : locked ? 'Locked' : era.id}</span>
                    <strong>{era.site}</strong>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="kolkata-play-panel">
            <div className="kolkata-hud">
              <span>Era {eraIndex + 1} of 4</span>
              <strong>{activeEra.title}</strong>
              <span>Legacy {buildQuality}%</span>
            </div>

            <div className={`kolkata-map-scene era-${activeEra.id} ${activeEraBuilt ? 'is-built' : 'is-building'}`} aria-hidden="true">
              <div className="kolkata-sun" />
              <div className="kolkata-cloud cloud-one" />
              <div className="kolkata-cloud cloud-two" />
              <div className="kolkata-cloud cloud-three" />
              <div className="hooghly-river" />
              <div className="kolkata-river-shine" />
              <div className="howrah-bridge">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className={`kolkata-build-site era-${eraIndex}`}>
                {buildKolkataEras.map((era, index) => {
                  const built = builtEras.some((item) => item.eraId === era.id);
                  return (
                    <span
                      key={era.id}
                      className={`city-node node-${index} ${eraIndex === index ? 'active' : ''} ${built ? 'built' : ''}`}
                    >
                      <i />
                    </span>
                  );
                })}
              </div>
              <div className="kolkata-era-hero">
                <span className="site-shadow" />
                <span className="site-ground" />
                <span className="construction-crane">
                  <i />
                  <i />
                  <i />
                </span>
                {activeEra.id === '1970s' && (
                  <span className={`era-graphic bridge-graphic ${activeEraBuilt ? 'built' : ''}`}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                {activeEra.id === '1990s' && (
                  <span className={`era-graphic housing-graphic ${activeEraBuilt ? 'built' : ''}`}>
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                {activeEra.id === '2010s' && (
                  <span className={`era-graphic factory-graphic ${activeEraBuilt ? 'built' : ''}`}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                {activeEra.id === 'today' && (
                  <span className={`era-graphic smart-city-graphic ${activeEraBuilt ? 'built' : ''}`}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                <span className={`product-preview ${selectedProductId}`}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="kolkata-skyline">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="kolkata-tree-row">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="kolkata-road-grid">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="kolkata-product-dock" aria-label="Choose SRMB product">
              {buildKolkataProducts.map((product) => {
                const ProductIcon = product.icon;
                const isSelected = selectedProductId === product.id;
                return (
                  <button
                    key={product.id}
                    className={`${isSelected ? 'active' : ''} ${product.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setLastResult(null);
                    }}
                  >
                    <span className="product-badge">
                      <ProductIcon aria-hidden="true" />
                    </span>
                    <span className="product-mini" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <strong>{product.label}</strong>
                    <small>{product.use}</small>
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="kolkata-action-panel">
            <div className="kolkata-score-card">
              <span>City Score</span>
              <strong>{totalScore}</strong>
              <small>{completedCount}/4 eras complete</small>
            </div>

            <div className="kolkata-selected-product">
              <span className="game-kicker">Selected Product</span>
              <strong>{selectedProduct.label}</strong>
              <p>{selectedProduct.use}</p>
            </div>

            <button className="build-city-button" type="button" onClick={handleBuildAction} disabled={isComplete && activeEraBuilt}>
              <Hammer aria-hidden="true" />
              {buildButtonLabel}
            </button>

            <button className="reset-city-button" type="button" onClick={resetCity}>
              <RotateCcw aria-hidden="true" />
              Reset City
            </button>

            <div className={`kolkata-result-card ${lastResult?.type || ''}`}>
              <Trophy aria-hidden="true" />
              <h2>{lastResult ? lastResult.title : 'Ready to Build'}</h2>
              <p>{lastResult ? lastResult.message : `For ${activeEra.site}, choose the best SRMB product and press Build Now.`}</p>
            </div>
          </aside>
        </section>

        <GameBackButton onBack={onBack} />
        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}

// Product-awareness quiz that teaches users how to identify genuine SRMB steel.
function SpotFakeGame({ onBack, onNavigate }) {
  const [activeClueId, setActiveClueId] = useState(spotFakeClues[0].id);
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 48 });
  const activeClue = spotFakeClues.find((clue) => clue.id === activeClueId) || spotFakeClues[0];
  const selectedSample = spotFakeSamples.find((sample) => sample.id === selectedSampleId);
  const selectedCorrectly = Boolean(selectedSample?.isFake);

  function updateLens(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(92, Math.max(8, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(88, Math.max(12, ((event.clientY - bounds.top) / bounds.height) * 100));
    setLensPosition({ x, y });
  }

  function confirmAnswer() {
    if (!selectedSampleId) {
      return;
    }

    setRevealed(true);
  }

  function resetCase() {
    setActiveClueId(spotFakeClues[0].id);
    setSelectedSampleId('');
    setRevealed(false);
    setLensPosition({ x: 50, y: 48 });
  }

  return (
    <main className="screen about-screen game-screen title-simple-page">
      <section className={`about-panel game-panel detective-panel ${revealed ? 'revealed' : ''} ${selectedCorrectly ? 'case-solved' : 'case-missed'}`}>
        <header className="about-header">
          <div className="about-title-bar">
            <h1>SPOT THE FAKE</h1>
          </div>
          <div className="about-logo-box">
            <img src="/assets/applogo/download.png" alt="SRMB" />
          </div>
        </header>

        <section className="detective-game-stage" aria-label="Spot the Fake steel detective game">
          <aside className="detective-case-panel">
            <div className="detective-brief-card">
              <span className="game-kicker">Case File</span>
              <h2>Find the counterfeit steel</h2>
              <p>Inspect the samples, select the suspicious bar, and confirm your answer.</p>
            </div>

            <div className="detective-clue-list" aria-label="Inspection clue filters">
              <span className="game-kicker">Inspection Lens</span>
              {spotFakeClues.map((clue) => (
                <button
                  key={clue.id}
                  className={activeClueId === clue.id ? 'active' : ''}
                  type="button"
                  onClick={() => setActiveClueId(clue.id)}
                >
                  <span>{clue.label}</span>
                  <small>{clue.defect}</small>
                </button>
              ))}
            </div>
          </aside>

          <article className="detective-lab-panel">
            <div className="detective-hud">
              <span>Steel Detective</span>
              <strong>{activeClue.label}</strong>
              <span>Drag the lens</span>
            </div>

            <div
              className="detective-lab-scene"
              style={{ '--lens-x': `${lensPosition.x}%`, '--lens-y': `${lensPosition.y}%` }}
              onPointerMove={updateLens}
            >
              <div className="lab-grid" aria-hidden="true" />
              <div className="lab-light" aria-hidden="true" />
              <div className="magnifier-lens" aria-hidden="true">
                <span />
              </div>

              <div className="sample-table">
                {spotFakeSamples.map((sample) => {
                  const selected = selectedSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      className={`detective-sample ${sample.isFake ? 'fake-sample' : 'genuine-sample'} ${selected ? 'selected' : ''}`}
                      type="button"
                      onClick={() => {
                        setSelectedSampleId(sample.id);
                        setRevealed(false);
                      }}
                    >
                      <span className="sample-label">{sample.label}</span>
                      <strong>{sample.name}</strong>
                      <span className="steel-specimen" aria-hidden="true">
                        {sample.image ? (
                          <img className="original-srmb-bar-image" src={sample.image} alt="" draggable="false" />
                        ) : (
                          <>
                            <i />
                            <i />
                          </>
                        )}
                        <span className="bar-stamp">{sample.stamp}</span>
                        <span className="bar-heat">{sample.heat}</span>
                        <span className="bar-crack" />
                      </span>
                      <span className="sample-finding">
                        {sample.findings[activeClueId]}
                      </span>
                      <span className="sample-pick-state">
                        {selected ? 'Selected' : 'Tap to choose'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="detective-xray" aria-hidden={!revealed}>
                {spotFakeSamples.map((sample) => (
                  <span key={sample.id} className={sample.isFake ? 'xray-bad' : 'xray-good'}>
                    <i />
                    <strong>{sample.isFake ? 'Defect found' : 'Certified quality'}</strong>
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className="detective-result-panel">
            <div className="detective-score-card">
              <span>Case Confidence</span>
              <strong>{revealed ? (selectedCorrectly ? '100' : '42') : selectedSample ? '68' : '00'}</strong>
              <small>{revealed ? 'X-ray complete' : 'Select the fake sample'}</small>
            </div>

            <button className="detective-confirm-button" type="button" onClick={confirmAnswer} disabled={!selectedSampleId || revealed}>
              <ShieldCheck aria-hidden="true" />
              Confirm Answer
            </button>

            <button className="reset-city-button detective-reset-button" type="button" onClick={resetCase}>
              <RotateCcw aria-hidden="true" />
              Reset Case
            </button>

            <div className={`detective-result-card ${revealed ? (selectedCorrectly ? 'success' : 'warning') : ''}`}>
              {revealed && selectedCorrectly ? <Check aria-hidden="true" /> : revealed ? <X aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
              <h2>
                {revealed
                  ? selectedCorrectly
                    ? 'Counterfeit Caught'
                    : 'Recheck the Evidence'
                  : 'Awaiting Your Verdict'}
              </h2>
              <p>
                {revealed
                  ? selectedCorrectly
                    ? 'Sample B is fake: wrong BIS marking, wide ribs, crack marks and no heat number.'
                    : 'Sample A is genuine SRMB steel. The fake product is Sample B.'
                  : 'Real SRMB bars carry the BIS/ISI mark, are third-party tested, and show the mill heat number.'}
              </p>
            </div>

            <div className="detective-checklist">
              <span className="game-kicker">Quality Checklist</span>
              {spotFakeClues.map((clue) => (
                <p key={clue.id}>
                  <Check aria-hidden="true" />
                  <span>{clue.safe}</span>
                </p>
              ))}
            </div>
          </aside>
        </section>

        <GameBackButton onBack={onBack} />
        <PrimaryNav activePage="game-corner" onNavigate={onNavigate} />
      </section>
    </main>
  );
}
