import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import shellLogo from "@/assets/shell-logo.png";

const HEX_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'><path d='M28 0L56 16v32L28 64 0 48V16z' fill='none' stroke='%23FFCC00' stroke-opacity='0.07' stroke-width='1.2'/></svg>\")";

type Props = {
  title: string;
  subtitle?: string;
  back?: string | false;
  badge?: string;
  eyebrow?: string;
  icon?: ReactNode;
  right?: ReactNode;
  size?: "sm" | "md";
};

export function AppHeader({
  title,
  subtitle,
  back = false,
  badge,
  eyebrow,
  icon,
  right,
  size = "md",
}: Props) {
  return (
    <header
      className="relative overflow-hidden bg-shell-ink text-white"
      style={{ backgroundImage: HEX_BG }}
    >
      {/* soft red glow */}
      <span className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-shell-red/30 blur-3xl" />
      <span className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-shell-yellow/10 blur-2xl" />

      <div className={`relative ${size === "sm" ? "px-4 pt-5 pb-5" : "px-5 pt-5 pb-7"}`}>
        {/* top row */}
        <div className="flex items-center gap-3">
          {back ? (
            <Link
              to={back}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 transition active:scale-95"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </Link>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-shell-yellow p-1">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" width={40} height={40} />
            </div>
          )}
          <div className="flex-1 truncate">
            {eyebrow && (
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-shell-yellow">{eyebrow}</div>
            )}
            <div className="truncate text-lg font-extrabold leading-tight">{title}</div>
          </div>
          {right}
        </div>

        {(subtitle || icon || badge) && (
          <div className="mt-4 flex items-center gap-3">
            {icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-shell-yellow/30 bg-shell-yellow/10 text-shell-yellow">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
              {badge && (
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-shell-yellow px-2.5 py-0.5 text-[11px] font-extrabold text-shell-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-shell-red" />
                  {badge}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* signal stripe */}
      <div className="flex h-1.5 w-full">
        <span className="flex-1 bg-shell-yellow" />
        <span className="w-10 bg-shell-red" />
        <span className="w-3 bg-shell-yellow" />
      </div>
    </header>
  );
}
