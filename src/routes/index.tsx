import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: UnderConstructionPage,
});

function UnderConstructionPage() {
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
          This page is being rebuilt. Check back soon for the next update.
        </p>
      </section>
    </main>
  );
}
