import React, { useEffect, useMemo, useState } from "react";

const TOTAL_DISTANCE = 10;
const TARGET_TIME = 15 * 60;
const INITIAL_SPEED = 40;

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":");
}

function App() {
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const finished = distance >= TOTAL_DISTANCE;

  useEffect(() => {
    if (!running || finished) return undefined;

    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
      setDistance((value) => Math.min(TOTAL_DISTANCE, value + speed / 3600));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, speed, finished]);

  const eta = useMemo(() => {
    if (finished) return elapsed;
    if (speed === 0) return null;
    return elapsed + ((TOTAL_DISTANCE - distance) / speed) * 3600;
  }, [distance, elapsed, finished, speed]);

  const delay = eta === null ? null : eta - TARGET_TIME;
  const progress = Math.min((distance / TOTAL_DISTANCE) * 100, 100);

  function reset() {
    setRunning(false);
    setSpeed(INITIAL_SPEED);
    setDistance(0);
    setElapsed(0);
  }

  return (
    <main className="page-shell">
      <section className="simulator" aria-labelledby="page-title">
        <header className="heading">
          <div>
            <p className="eyebrow">PANEL PODRÓŻY</p>
            <h1 id="page-title">Symulator przejazdu</h1>
            <p className="subtitle">Steruj prędkością i obserwuj postęp na trasie.</p>
          </div>
          <div className={`status ${running ? "status-running" : ""}`}>
            <span className="status-dot" />
            {finished ? "Na miejscu" : running ? "W trasie" : "Postój"}
          </div>
        </header>

        <section className="route-card" aria-label="Postęp podróży">
          <div className="route-topline">
            <span>TRASA</span>
            <strong>{distance.toFixed(2)} <small>/ {TOTAL_DISTANCE} km</small></strong>
          </div>
          <div
            className="route-track"
            role="progressbar"
            aria-label="Postęp trasy"
            aria-valuemin={0}
            aria-valuemax={TOTAL_DISTANCE}
            aria-valuenow={Number(distance.toFixed(2))}
          >
            <div className="route-fill" style={{ width: `${progress}%` }} />
            <span className="car" style={{ left: `${progress}%` }} aria-label="Samochód" role="img">🚙</span>
            <span className="destination-marker" />
          </div>
          <div className="route-endpoints"><span>START</span><span>META · 10 km</span></div>
        </section>

        <section className="speed-card">
          <div className="speed-heading">
            <label htmlFor="speed">Prędkość pojazdu</label>
            <output htmlFor="speed">{speed}<span> km/h</span></output>
          </div>
          <input
            id="speed"
            type="range"
            min="0"
            max="100"
            step="1"
            value={speed}
            style={{ "--range-progress": `${speed}%` }}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
          <div className="range-labels"><span>0 km/h</span><span>100 km/h</span></div>
          <div className="actions">
            <button className="button-primary" onClick={() => setRunning(true)} disabled={finished || running}>
              <span aria-hidden="true">▶</span> Start
            </button>
            <button className="button-secondary" onClick={() => setRunning(false)} disabled={!running}>
              <span aria-hidden="true">Ⅱ</span> Pauza
            </button>
            <button className="button-reset" onClick={reset}>Reset</button>
          </div>
        </section>

        <section className="metrics" aria-label="Dane podróży" aria-live="polite">
          <article className="metric">
            <span className="metric-icon">◷</span>
            <div><p>MINĘŁO</p><strong>{formatDuration(elapsed)}</strong></div>
          </article>
          <article className="metric">
            <span className="metric-icon">⌖</span>
            <div><p>POZOSTAŁO</p><strong>{Math.max(0, TOTAL_DISTANCE - distance).toFixed(2)} <small>km</small></strong></div>
          </article>
          <article className="metric">
            <span className="metric-icon">◷</span>
            <div><p>PRZYJAZD (ETA)</p><strong>{eta === null ? "— — : — — : — —" : formatDuration(eta)}</strong></div>
          </article>
        </section>

        <footer className={`arrival ${delay === null ? "arrival-neutral" : delay <= 0 ? "arrival-early" : "arrival-late"}`}>
          <span>{delay === null ? "◇" : delay <= 0 ? "✓" : "!"}</span>
          {finished
            ? `Podróż zakończona po ${formatDuration(elapsed)}.`
            : delay === null
              ? "Ustaw prędkość powyżej 0 km/h, aby obliczyć ETA."
              : delay <= 0
                ? `Planowo lub przed czasem · ${formatDuration(Math.abs(delay))} do celu`
                : `Przewidywane opóźnienie: ${formatDuration(delay)} · plan: ${formatDuration(TARGET_TIME)}`}
        </footer>
      </section>
      <p className="note">Symulacja w czasie rzeczywistym · czas docelowy: 00:15:00</p>
    </main>
  );
}

export default App;
