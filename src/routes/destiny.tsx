import { createFileRoute } from "@tanstack/react-router";
import { DestinyLanding } from "../components/destiny/DestinyLanding";

export const Route = createFileRoute("/destiny")({
  component: DestinyLanding,
});
