import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SynthwaveBackground } from "../../components/synthwave/SynthwaveBackground";
import "../../styles/synthwave.css";

export const Route = createFileRoute("/synthwave")({
  component: SynthwaveLayout,
});

function SynthwaveLayout() {
  return (
    <div className="sw-root">
      <SynthwaveBackground />
      <Outlet />
    </div>
  );
}
