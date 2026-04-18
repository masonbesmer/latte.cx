import { useState, useEffect, useRef } from "react";

const TITLE = "USER_7742";
const SUBTITLE_LINES = [
  "PROGRAM IDENTITY CONFIRMED",
  "SYSTEM: ENCOM MAINFRAME",
  "ACCESS LEVEL: ADMINISTRATOR",
  "GRID COORDINATES: SECTOR 7",
];
const SCRAMBLE_CHARS = "!@#$%^&*█▓▒░";

export function TronHero() {
  const [titleChars, setTitleChars] = useState<string[]>(
    TITLE.split("").map(() => SCRAMBLE_CHARS[0]),
  );
  const [subtitleText, setSubtitleText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [scanReady, setScanReady] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const intervals = intervalsRef.current;
    const timeouts = timeoutsRef.current;
    const chars = TITLE.split("");
    const SCRAMBLE_DURATION = 1200;
    const CHAR_STAGGER = 60;

    chars.forEach((targetChar, i) => {
      const resolveAt = SCRAMBLE_DURATION + i * CHAR_STAGGER;
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 50;
        if (elapsed >= resolveAt) {
          setTitleChars((prev) => {
            const next = [...prev];
            next[i] = targetChar;
            return next;
          });
          clearInterval(interval);
          if (i === chars.length - 1) {
            const id = setTimeout(() => {
              setScanReady(true);
              startSubtitle();
            }, 200);
            timeoutsRef.current.push(id);
          }
        } else {
          setTitleChars((prev) => {
            const next = [...prev];
            next[i] =
              SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            return next;
          });
        }
      }, 50);
      intervalsRef.current.push(interval);
    });

    const cursorId = setInterval(() => setCursorVisible((v) => !v), 530);
    intervalsRef.current.push(cursorId);

    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  function startSubtitle() {
    let idx = 0;
    const line = SUBTITLE_LINES[0];

    function typeNext() {
      if (idx < line.length) {
        setSubtitleText((prev) => prev + line[idx]);
        idx++;
        const id = setTimeout(typeNext, 35);
        timeoutsRef.current.push(id);
      } else {
        setSubtitleDone(true);
      }
    }

    const id = setTimeout(typeNext, 150);
    timeoutsRef.current.push(id);
  }

  return (
    <section className="tron-hero" aria-label="Hero section">
      <div className="tron-hero-inner">
        {scanReady && <div className="tron-scan-bar" aria-hidden="true" />}

        <div className="tron-hero-label">
          // PROGRAM INITIALIZATION SEQUENCE
        </div>

        <h1 className="tron-hero-title" aria-label={TITLE}>
          {titleChars.map((char, i) => (
            <span key={i} className="tron-title-char">
              {char}
            </span>
          ))}
        </h1>

        <p className="tron-hero-subtitle">
          <span className="tron-prompt">&gt;&gt; </span>
          {subtitleText}
          <span
            className="tron-cursor"
            style={{ opacity: cursorVisible && !subtitleDone ? 1 : 0 }}
          >
            ▋
          </span>
        </p>

        <div className="tron-hero-nav">
          <a href="#about" className="tron-nav-link">
            [IDENTITY FILE]
          </a>
          <a href="#projects" className="tron-nav-link">
            [DATA BLOCKS]
          </a>
          <a href="#skills" className="tron-nav-link">
            [CIRCUIT MAP]
          </a>
          <a href="#contact" className="tron-nav-link">
            [UPLINK]
          </a>
        </div>
      </div>

      <style>{`
        .tron-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          padding: 2rem 1rem;
          overflow: hidden;
        }
        .tron-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .tron-scan-bar {
          position: absolute;
          top: 0; left: -10%; width: 120%; height: 2px;
          background: linear-gradient(90deg, transparent, #00AAFF, #FFFFFF, #00AAFF, transparent);
          box-shadow: 0 0 20px #00AAFF, 0 0 40px rgba(0,170,255,0.5);
          animation: tron-scan 1.8s ease forwards;
          pointer-events: none;
        }
        @keyframes tron-scan {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .tron-hero-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(0,170,255,0.55);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .tron-hero-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 10vw, 7rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FFFFFF;
          text-shadow:
            0 0 10px #00AAFF,
            0 0 25px #00AAFF,
            0 0 50px rgba(0,170,255,0.6),
            0 0 80px rgba(0,170,255,0.3);
          margin: 0;
          line-height: 1.1;
        }
        .tron-title-char { display: inline-block; }
        .tron-hero-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          color: #00AAFF;
          letter-spacing: 0.08em;
          margin: 0;
          min-height: 1.6em;
          text-shadow: 0 0 8px rgba(0,170,255,0.7);
        }
        .tron-prompt { color: #FFCC00; text-shadow: 0 0 6px rgba(255,204,0,0.7); }
        .tron-cursor {
          color: #FFCC00;
          text-shadow: 0 0 6px rgba(255,204,0,0.7);
          transition: opacity 0.05s;
          display: inline-block;
        }
        .tron-hero-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
          justify-content: center;
          margin-top: 1rem;
        }
        .tron-nav-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.875rem;
          color: #FFCC00;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-shadow: 0 0 8px rgba(255,204,0,0.5);
          transition: color 0.2s, text-shadow 0.2s;
          border: 1px solid rgba(255,204,0,0.3);
          padding: 0.35rem 0.85rem;
        }
        .tron-nav-link:hover,
        .tron-nav-link:focus-visible {
          color: #FFFFFF;
          text-shadow: 0 0 12px #FFCC00, 0 0 24px rgba(255,204,0,0.4);
          border-color: rgba(255,204,0,0.8);
          outline: none;
        }
      `}</style>
    </section>
  );
}
