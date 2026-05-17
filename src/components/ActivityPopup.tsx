import { useEffect, useState } from "react";
import { ShoppingCart, Wallet, UserPlus, BadgeCheck, X } from "lucide-react";

type Kind = "purchase" | "recharge" | "invite";

const FIRST = ["Juan","Maria","Jose","Ana","Mark","Liza","Paolo","Grace","Carlo","Joy","Reyna","Andres","Bea","Diego","Aira","Kim","Angelo","Trisha","Miguel","Jasmin","Rico","Cherry","Lance","Nica","Renz","Kris","Daryl","Mae","Patrick","Sheryl"];
const LAST = ["Santos","Reyes","Cruz","Garcia","Bautista","Dela Cruz","Mendoza","Aquino","Ramos","Torres","Castillo","Villanueva","Gonzales","Rivera","Domingo","Navarro","Pascual","Lim","Tan","Aguilar"];
const PLANS = ["Plan 1","Plan 2","Plan 3","Plan 4","VIP 1","VIP 2"];
const RECHARGE = [200,350,500,800,1000,1500,2000,2500,3500,5000,7500,10000];
const PURCHASE = [250,500,1000,2500,5000,10000];
const CITIES = ["Manila","Quezon City","Cebu","Davao","Makati","Pasig","Taguig","Iloilo","Bacolod","Cagayan de Oro","Zamboanga","Baguio","Caloocan","Las Piñas","Parañaque"];

const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
const maskedPhone = () => {
  const prefix = pick(["917","918","919","920","921","927","935","939","945","949","963","966","977","995"]);
  const tail = (1000 + Math.floor(Math.random() * 9000)).toString();
  return `+63 ${prefix} ***${tail.slice(-4)}`;
};

type Toast = {
  id: number;
  kind: Kind;
  name: string;
  action: string;
  amount?: string;
  city: string;
  minsAgo: number;
};

let _id = 0;
function makeToast(): Toast {
  const kind: Kind = pick(["purchase", "purchase", "recharge", "recharge", "invite"] as const);
  const city = pick(CITIES);
  const minsAgo = 1 + Math.floor(Math.random() * 12);
  _id += 1;
  if (kind === "purchase") {
    return {
      id: _id, kind, city, minsAgo,
      name: `${pick(FIRST)} ${pick(LAST)}`,
      action: `just purchased ${pick(PLANS)}`,
      amount: `₱${pick(PURCHASE).toLocaleString()}`,
    };
  }
  if (kind === "recharge") {
    return {
      id: _id, kind, city, minsAgo,
      name: `${pick(FIRST)} ${pick(LAST)}`,
      action: `recharged wallet`,
      amount: `₱${pick(RECHARGE).toLocaleString()}`,
    };
  }
  return {
    id: _id, kind, city, minsAgo,
    name: maskedPhone(),
    action: `just joined Shell Oil`,
  };
}

const META: Record<Kind, { Icon: typeof ShoppingCart; tint: string; ring: string; amount: string; bar: string }> = {
  purchase: {
    Icon: ShoppingCart,
    tint: "bg-shell-red text-white",
    ring: "ring-shell-red/20",
    amount: "text-shell-red",
    bar: "bg-shell-red",
  },
  recharge: {
    Icon: Wallet,
    tint: "bg-shell-amber text-white",
    ring: "ring-shell-amber/30",
    amount: "text-shell-amber",
    bar: "bg-shell-amber",
  },
  invite: {
    Icon: UserPlus,
    tint: "bg-shell-green text-white",
    ring: "ring-shell-green/25",
    amount: "text-shell-green",
    bar: "bg-shell-green",
  },
};

const DISPLAY_MS = 4800;
const INTERVAL_MS = 6500;
const FIRST_DELAY_MS = 2500;

export function ActivityPopup() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let clearTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      setToast(makeToast());
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), DISPLAY_MS);
      clearTimer = setTimeout(() => setToast(null), DISPLAY_MS + 400);
    };

    const first = setTimeout(show, FIRST_DELAY_MS);
    const cycle = setInterval(show, INTERVAL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(cycle);
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, []);

  if (!toast) return null;
  const m = META[toast.kind];
  const Icon = m.Icon;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-3 sm:bottom-6 sm:left-4 sm:right-auto sm:justify-start sm:px-0"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto relative w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_-12px_rgba(221,29,33,0.35)] ring-1 ${m.ring} transition-all duration-400 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 p-3 pr-9">
          <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${m.tint}`}>
            <Icon size={20} strokeWidth={2.4} />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <BadgeCheck size={14} className="text-shell-green" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate text-sm font-extrabold text-foreground">
              <span className="truncate">{toast.name}</span>
              <span className="text-base leading-none">🇵🇭</span>
              <span className="text-[10px] font-bold text-muted-foreground">· {toast.city}</span>
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {toast.action}
              {toast.amount && (
                <>
                  {" "}
                  <span className={`font-extrabold ${m.amount}`}>{toast.amount}</span>
                </>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-shell-green/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-shell-green" />
              </span>
              Verified · {toast.minsAgo} min ago
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X size={14} />
          </button>
        </div>
        <div className="h-1 w-full bg-muted/60">
          <div
            key={toast.id}
            className={`h-full ${m.bar}`}
            style={{
              animation: visible ? `tickerBar ${DISPLAY_MS}ms linear forwards` : undefined,
            }}
          />
        </div>
        <style>{`@keyframes tickerBar { from { width: 100%; } to { width: 0%; } }`}</style>
      </div>
    </div>
  );
}
