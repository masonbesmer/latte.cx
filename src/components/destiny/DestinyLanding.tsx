import React, { type CSSProperties } from "react";
import { StarChart } from "./StarChart";

export function DestinyLanding() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        background: "#06090f",
        overflow: "hidden",
      }}
    >
      <StarChart />

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "3rem 4rem",
            textAlign: "center",
            maxWidth: 560,
          }}
        >
          {/* Corner brackets */}
          {(
            [
              { top: 0, left: 0, borderTop: "1px solid rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.35)" },
              { top: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.35)", borderRight: "1px solid rgba(255,255,255,0.35)" },
              { bottom: 0, left: 0, borderBottom: "1px solid rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.35)" },
              { bottom: 0, right: 0, borderBottom: "1px solid rgba(255,255,255,0.35)", borderRight: "1px solid rgba(255,255,255,0.35)" },
            ] as CSSProperties[]
          ).map((style, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                ...style,
              }}
            />
          ))}

          {/* Ghost icon */}
          <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: 32,
              height: 32,
              margin: "0 auto 1.5rem",
              display: "block",
              animation: "ghost-pulse 3s ease-in-out infinite",
            }}
          >
            <polygon
              points="16,2 28,10 28,22 16,30 4,22 4,10"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1"
            />
            <polygon
              points="16,7 23,12 23,20 16,25 9,20 9,12"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.5"
            />
            <circle cx="16" cy="16" r="2.5" fill="rgba(120,180,255,0.9)" />
          </svg>

          {/* Site label */}
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 1rem",
              textTransform: "uppercase",
            }}
          >
            LATTE.CX
          </p>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 5vw, 4rem)",
              color: "#ffffff",
              margin: "0 0 1.5rem",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              textShadow:
                "0 0 20px rgba(120,180,255,0.6), 0 0 50px rgba(120,180,255,0.3)",
            }}
          >
            THIS SECTOR IS OFFLINE
          </h1>

          {/* Separator */}
          <div
            aria-hidden="true"
            style={{
              width: 120,
              height: 1,
              background: "rgba(255,255,255,0.2)",
              margin: "0 auto 1.5rem",
            }}
          />

          {/* Sub-text */}
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Guardian access restricted. Check back soon.
          </p>

          <style>{`
            @keyframes ghost-pulse {
              0%, 100% { opacity: 0.7; transform: translateY(0px); }
              50%       { opacity: 1;   transform: translateY(-4px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
