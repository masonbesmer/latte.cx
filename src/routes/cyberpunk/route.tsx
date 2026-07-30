import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BraindanceIntro } from "../../components/cyberpunk/BraindanceIntro";
import { BackgroundScene } from "../../components/cyberpunk/BackgroundScene";
import { ScanlineTransition } from "../../components/cyberpunk/ScanlineTransition";
import * as audio from "../../lib/audio/braindance";
import "../../styles/globals.css";
import "../../styles/tokens.css";

export const Route = createFileRoute("/cyberpunk")({
  component: CyberpunkLayout,
});

function CyberpunkLayout() {
  const [showIntro, setShowIntro] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("braindance-seen");
    if (!seen) {
      setShowIntro(true);
    } else {
      setSceneReady(true);
    }
  }, []);

  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  function onIntroComplete() {
    setShowIntro(false);
    setSceneReady(true);
  }

  return (
    <>
      {sceneReady && <BackgroundScene />}
      {showIntro && (
        <BraindanceIntro onComplete={onIntroComplete} muted={muted} />
      )}
      <div style={{ minHeight: "100vh", width: "100%" }}>
        <ScanlineTransition />
        <Outlet />
      </div>
      <button
        className="audio-toggle"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? "Unmute audio" : "Mute audio"}
        style={{
          position: "fixed",
          bottom: "1.25rem",
          right: "1.5rem",
          zIndex: 100,
          background: "rgba(10, 10, 15, 0.7)",
          border: "1px solid rgba(2, 215, 242, 0.3)",
          color: "#02D7F2",
          fontSize: "1rem",
          width: "2.25rem",
          height: "2.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: 2,
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </>
  );
}
