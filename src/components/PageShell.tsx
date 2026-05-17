import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PageShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="min-h-screen bg-shell-ink/95">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-shell-cream pb-28 shadow-2xl">
        {children}
        {nav && <BottomNav />}
      </div>
    </div>
  );
}
