import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Brush, Check, Download, Eraser, Highlighter, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import '../styles/pages/NotesPage.css';

const NOTE_KEY = 'srmb-keep-note';
const COLORS = ['#161616', '#c9342f', '#e99d16', '#1f8a55', '#2877d4', '#7355bd'];
const TOOL_SETTINGS = {
  pen: { width: 4, alpha: 1 }, pencil: { width: 2, alpha: 0.72 },
  highlighter: { width: 22, alpha: 0.28 }, eraser: { width: 34, alpha: 1 },
};

export default function NotesPage({ onBack }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const pointRef = useRef(null);
  const canvasMetricsRef = useRef(null);
  const historyRef = useRef([]);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [saved, setSaved] = useState(false);

  // Use the standard transparent canvas compositor for consistent white
  // rendering in Electron; touch smoothing is handled by coalesced points.
  const getContext = () => canvasRef.current?.getContext('2d');

  function snapshot() {
    const canvas = canvasRef.current;
    if (canvas) historyRef.current = [...historyRef.current.slice(-19), canvas.toDataURL('image/png')];
  }

  const paintImage = useCallback((source) => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context || !source) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = source;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = canvas?.parentElement;
    if (!canvas || !shell) return undefined;
    const resizeCanvas = () => {
      const previous = canvas.width ? canvas.toDataURL('image/png') : localStorage.getItem(NOTE_KEY);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const bounds = shell.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      canvasMetricsRef.current = {
        left: bounds.left,
        top: bounds.top,
        scaleX: canvas.width / bounds.width,
        scaleY: canvas.height / bounds.height,
        ratio,
      };
      if (previous) paintImage(previous);
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(shell);
    return () => observer.disconnect();
  }, [paintImage]);

  function canvasPoint(event) {
    const canvas = canvasRef.current;
    let metrics = canvasMetricsRef.current;
    if (!metrics) {
      const bounds = canvas.getBoundingClientRect();
      metrics = {
        left: bounds.left,
        top: bounds.top,
        scaleX: canvas.width / bounds.width,
        scaleY: canvas.height / bounds.height,
        ratio: Math.min(window.devicePixelRatio || 1, 1.5),
      };
      canvasMetricsRef.current = metrics;
    }
    return {
      x: (event.clientX - metrics.left) * metrics.scaleX,
      y: (event.clientY - metrics.top) * metrics.scaleY,
    };
  }

  function beginStroke(event) {
    event.preventDefault();
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    canvasMetricsRef.current = {
      left: bounds.left,
      top: bounds.top,
      scaleX: canvas.width / bounds.width,
      scaleY: canvas.height / bounds.height,
      ratio: canvas.width / bounds.width,
    };
    snapshot();
    drawingRef.current = true;
    pointRef.current = canvasPoint(event);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function drawStroke(event) {
    if (!drawingRef.current) return;
    event.preventDefault();
    const context = getContext();
    const settings = TOOL_SETTINGS[tool];
    const nativeEvent = event.nativeEvent || event;
    const coalescedEvents = nativeEvent.getCoalescedEvents?.();
    const pointerEvents = coalescedEvents?.length ? coalescedEvents : [nativeEvent];
    const ratio = canvasMetricsRef.current?.ratio || 1;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = settings.width * ratio;
    context.globalAlpha = settings.alpha;
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(pointRef.current.x, pointRef.current.y);
    pointerEvents.forEach((pointerEvent) => {
      const nextPoint = canvasPoint(pointerEvent);
      context.lineTo(nextPoint.x, nextPoint.y);
      pointRef.current = nextPoint;
    });
    context.stroke();
  }

  function endStroke(event) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    pointRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function undo() {
    const previous = historyRef.current.pop();
    if (previous) paintImage(previous);
  }

  function clearNote() {
    snapshot();
    const canvas = canvasRef.current;
    getContext()?.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveNote() {
    localStorage.setItem(NOTE_KEY, canvasRef.current.toDataURL('image/png'));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function downloadNote() {
    const canvas = canvasRef.current;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const context = exportCanvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    context.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = `SRMB-note-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }

  const tools = [
    { id: 'pen', label: 'Pen', icon: Brush }, { id: 'pencil', label: 'Pencil', icon: Pencil },
    { id: 'highlighter', label: 'Highlighter', icon: Highlighter }, { id: 'eraser', label: 'Eraser', icon: Eraser },
  ];

  return (
    <main className="notes-page">
      <header className="notes-header">
        <div><span>SRMB Workspace</span><h1>Keep Notes</h1></div>
        <div className="notes-header-actions">
          <button type="button" onClick={downloadNote}><Download /><span>Download</span></button>
          <button className="notes-save" type="button" onClick={saveNote}>{saved ? <Check /> : null}<span>{saved ? 'Saved' : 'Save note'}</span></button>
        </div>
      </header>
      <section className="notes-paper" aria-label="Drawing note area">
        <canvas ref={canvasRef} onPointerDown={beginStroke} onPointerMove={drawStroke} onPointerUp={endStroke} onPointerCancel={endStroke} />
        <span className="notes-paper-hint">Write or draw anywhere</span>
      </section>
      <footer className="notes-toolbar" aria-label="Note drawing tools">
        <button className="notes-bottom-back" type="button" onClick={onBack} aria-label="Back to default page">
          <ArrowLeft /><span>Back</span>
        </button>
        <div className="notes-tools">
          {tools.map(({ id, label, icon: Icon }) => (
            <button className={tool === id ? 'is-active' : ''} type="button" key={id} onClick={() => setTool(id)} title={label}><Icon /><span>{label}</span></button>
          ))}
        </div>
        <div className="notes-colors" aria-label="Ink colors">
          {COLORS.map((item) => (
            <button className={color === item && tool !== 'eraser' ? 'is-active' : ''} type="button" key={item} style={{ '--note-color': item }} onClick={() => { setColor(item); if (tool === 'eraser') setTool('pen'); }} aria-label={`Use ${item} ink`} />
          ))}
        </div>
        <div className="notes-edit-actions">
          <button type="button" onClick={undo} title="Undo"><RotateCcw /></button>
          <button type="button" onClick={clearNote} title="Clear note"><Trash2 /></button>
        </div>
      </footer>
    </main>
  );
}
