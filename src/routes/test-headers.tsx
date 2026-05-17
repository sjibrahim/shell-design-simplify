import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/test-headers")({
  head: () => ({
    meta: [{ title: "Header Overlap QA" }],
  }),
  component: TestHeaders,
});

const ROUTES = [
  "/",
  "/profile",
  "/team",
  "/invite",
  "/recharge",
  "/withdraw",
  "/channel",
  "/mission",
  "/treasure-box",
  "/income-details",
  "/login",
  "/register",
];

const VIEWPORTS = [
  { label: "320 (small)", w: 320, h: 640 },
  { label: "360", w: 360, h: 720 },
  { label: "390 (iPhone)", w: 390, h: 742 },
  { label: "414", w: 414, h: 800 },
  { label: "480 (max)", w: 480, h: 820 },
];

function TestHeaders() {
  const [route, setRoute] = useState<string>("/profile");

  return (
    <div className="min-h-screen bg-neutral-100 p-4">
      <header className="mb-4 rounded-2xl bg-white p-4 shadow">
        <h1 className="text-xl font-extrabold">Header Overlap QA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each frame renders the route at a common phone width. Scan the seam where the red
          header meets the first card — title/icon must stay fully visible above the card edge.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROUTES.map((r) => (
            <button
              key={r}
              onClick={() => setRoute(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                route === r
                  ? "bg-shell-red text-white"
                  : "bg-neutral-200 text-foreground hover:bg-neutral-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-4">
        {VIEWPORTS.map((v) => (
          <figure
            key={v.label}
            className="rounded-2xl bg-white p-3 shadow"
            style={{ width: v.w + 24 }}
          >
            <figcaption className="mb-2 text-center text-xs font-bold text-muted-foreground">
              {v.label} — {route}
            </figcaption>
            <iframe
              key={route + v.label}
              src={route}
              title={`${route} @ ${v.label}`}
              style={{ width: v.w, height: v.h }}
              className="block rounded-xl border border-neutral-200"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
