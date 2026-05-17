import type { ReactNode } from "react";

export function GradientHeader({ children }: { children: ReactNode }) {
  return (
    <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-6 pb-16 pt-10 text-white">
      {/* decorative circles */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute right-20 top-24 h-28 w-28 rounded-full bg-white/5" />
      <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
      <div className="relative">{children}</div>
    </header>
  );
}
