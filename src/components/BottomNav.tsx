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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-white/95 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 pb-3 pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="relative flex flex-col items-center gap-1 py-1.5"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                    active ? "bg-shell-yellow/30" : ""
                  }`}
                >
                  <Icon
                    size={22}
                    className={active ? "text-shell-red" : "text-muted-foreground"}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    active ? "text-shell-red" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <span className="absolute -top-2 h-1 w-8 rounded-full bg-shell-red" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
