import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SecretRoutesNav } from "../components/SecretRoutesNav";

export const Route = createFileRoute("/")({
  component: UnderConstructionPage,
});

const TAPS_TO_REVEAL = 10;

function UnderConstructionPage() {
  const [tapCount, setTapCount] = useState(0);
  const revealed = tapCount >= TAPS_TO_REVEAL;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6">
      <section className="max-w-xl text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          Latte.cx
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold">
          Under Construction
        </h1>
        <p className="text-neutral-300">
          This page is being rebuilt. Check back{" "}
          <span
            onClick={() => setTapCount((count) => count + 1)}
            className="cursor-default select-none"
          >
            soon
          </span>{" "}
          for the next update.
        </p>
      </section>
      {revealed && <SecretRoutesNav />}
    </main>
  );
}
