import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TronGrid } from "../../components/tron/TronGrid";
import "../../styles/globals.css";
import "../../styles/tokens.css";

export const Route = createFileRoute("/tron")({
  component: TronLayout,
});

function TronLayout() {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // Defer Three.js scene mount to after initial render
    const id = setTimeout(() => setSceneReady(true), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {sceneReady && <TronGrid />}
      {/* Scanline overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9997,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        }}
      />
      {/* CRT vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "transparent",
          color: "#FFFFFF",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
