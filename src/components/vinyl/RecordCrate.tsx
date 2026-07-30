import { useRef, useState, useCallback, useEffect } from "react";
import type { Service } from "../../lib/vinyl-data";
import { crateItems } from "../../lib/vinyl-data";
import { RecordCard } from "./RecordCard";
import { CrateDividerCard } from "./CrateDividerCard";

interface RecordCrateProps {
  onServiceSelect: (service: Service | null) => void;
  selectedId: string | null;
}

export function RecordCrate({ onServiceSelect, selectedId }: RecordCrateProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery.trim()
    ? crateItems.filter((item) => {
        if (item.type === "divider") return false;
        const svc = item.data;
        const q = searchQuery.toLowerCase();
        return (
          svc.name.toLowerCase().includes(q) ||
          svc.category.toLowerCase().includes(q) ||
          svc.albumTitle.toLowerCase().includes(q)
        );
      })
    : crateItems;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!scrollRef.current) return;
      if (e.key === "ArrowRight") {
        scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
      } else if (e.key === "Escape") {
        onServiceSelect(null);
      }
    },
    [onServiceSelect],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section aria-label="Vinyl Record Crate">
      <div className="px-4 pb-3 flex items-center gap-3">
        <label htmlFor="crate-search" className="sr-only">
          Search records
        </label>
        <div className="relative flex-1 max-w-xs">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
            style={{ color: "var(--amber)", fontSize: 14 }}
          >
            🔍
          </span>
          <input
            id="crate-search"
            type="search"
            placeholder="Search records…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded pl-8 pr-3 py-1.5 font-mono"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid var(--copper)",
              color: "var(--cream)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
          ← → to scroll · click to select · click again to flip
        </span>
      </div>
      <div
        className="relative rounded-xl mx-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #2a1a10 0%, #3d2b1f 40%, #2a1a10 100%)",
          border: "3px solid var(--walnut-light)",
          boxShadow:
            "inset 0 4px 16px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.5)",
          padding: "12px 0 8px",
        }}
        role="region"
        aria-label="Record crate scrollable area"
      >
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 10,
            background:
              "linear-gradient(180deg, var(--copper) 0%, var(--walnut-light) 100%)",
            zIndex: 2,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 10,
            background:
              "linear-gradient(0deg, var(--copper) 0%, var(--walnut-light) 100%)",
            zIndex: 2,
          }}
          aria-hidden="true"
        />
        <div
          ref={scrollRef}
          className="flex items-end gap-3 overflow-x-auto pb-2 pt-1"
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            scrollSnapType: "x mandatory",
          }}
          tabIndex={0}
          aria-label="Records — use arrow keys to scroll"
        >
          {filteredItems.length === 0 && (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 260,
                height: 380,
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
                fontSize: 14,
              }}
            >
              No records found
            </div>
          )}
          {filteredItems.map((item) => {
            if (item.type === "divider") {
              return (
                <CrateDividerCard key={item.data.id} divider={item.data} />
              );
            }
            const svc = item.data;
            return (
              <div key={svc.id} style={{ scrollSnapAlign: "start" }}>
                <RecordCard
                  service={svc}
                  isSelected={selectedId === svc.id}
                  onClick={() =>
                    onServiceSelect(selectedId === svc.id ? null : svc)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
