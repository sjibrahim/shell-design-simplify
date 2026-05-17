import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function SubPage({
  title,
  subtitle,
  icon,
  children,
  back = "/",
  showBottomNav = true,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  back?: string;
  showBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-[#FAF4E6] pb-28 shadow-xl">
        <header className="relative overflow-hidden rounded-b-[2.5rem] bg-[linear-gradient(135deg,#DD1D21_0%,#A8161A_100%)] px-4 pb-24 pt-5 text-white">
          <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-shell-yellow/10" />
          <div className="relative flex items-center justify-between">
            <Link
              to={back}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl font-extrabold">{title}</h1>
            <span className="w-10" />
          </div>
          {(icon || subtitle) && (
            <div className="relative mt-5 flex items-center gap-3">
              {icon && (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  {icon}
                </div>
              )}
              {subtitle && <p className="text-sm text-white/85">{subtitle}</p>}
            </div>
          )}
        </header>
        <main className="relative z-10 -mt-10 px-4">{children}</main>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
