import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-[#FAF4E6] pb-28 shadow-xl">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
