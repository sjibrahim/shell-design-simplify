import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MailPlus, Users, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/invite", label: "Invite", icon: MailPlus },
  { to: "/team", label: "Team", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 bg-shell-ink text-white">
      <span className="block h-0.5 w-full bg-gradient-to-r from-shell-yellow via-shell-red to-shell-yellow" />
      <ul className="flex items-stretch justify-around px-2 pb-3 pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link to={to} className="relative flex flex-col items-center gap-1 py-1.5">
                {active && <span className="absolute -top-px h-0.5 w-10 bg-shell-yellow" />}
                <Icon
                  size={22}
                  className={active ? "text-shell-yellow" : "text-white/55"}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`text-[11px] font-bold tracking-wide ${
                    active ? "text-shell-yellow" : "text-white/55"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
