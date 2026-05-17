import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Wallet, UserPlus } from "lucide-react";

type Kind = "purchase" | "recharge" | "invite";

const FIRST = [
  "Juan", "Maria", "Jose", "Anna", "Mark", "Liza", "Paolo", "Grace", "Ravi",
  "Aisha", "Wei", "Mei", "Carlo", "Joy", "Noor", "Sami", "Ken", "Lyn", "Reyna",
  "Eli", "Tariq", "Bea", "Diego", "Fatima", "Hassan", "Ivy", "Kai", "Luna",
];
const LAST = [
  "S.", "R.", "M.", "C.", "L.", "D.", "T.", "P.", "B.", "K.", "G.", "F.", "V.",
];
const PLANS = ["Plan 1", "Plan 2", "Plan 3", "Plan 4", "VIP 1", "VIP 2"];
const RECHARGE_AMTS = [200, 350, 500, 800, 1000, 1500, 2000, 2500, 3500, 5000, 7500, 10000];
const PURCHASE_AMTS = [250, 500, 1000, 2500, 5000, 10000];

const CC = ["PH", "ID", "MY", "VN", "TH", "SG", "IN", "PK", "BD", "AE", "EG"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maskedPhone() {
  const a = 900 + Math.floor(Math.random() * 100);
  const b = 1000 + Math.floor(Math.random() * 9000);
  return `${a}****${b.toString().slice(-3)}`;
}

function relTime() {
  const mins = 1 + Math.floor(Math.random() * 58);
  return `${mins} min ago`;
}

type Entry = {
  id: number;
  name: string;
  meta: string;
  amount?: string;
  cc: string;
  time: string;
};

let _id = 0;
function makeEntry(kind: Kind): Entry {
  _id += 1;
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const cc = pick(CC);
  if (kind === "purchase") {
    return {
      id: _id,
      name,
      meta: `purchased ${pick(PLANS)}`,
      amount: `₱${pick(PURCHASE_AMTS).toLocaleString()}.00`,
      cc,
      time: relTime(),
    };
  }
  if (kind === "recharge") {
    return {
      id: _id,
      name,
      meta: `recharged wallet`,
      amount: `₱${pick(RECHARGE_AMTS).toLocaleString()}.00`,
      cc,
      time: relTime(),
    };
  }
  return {
    id: _id,
    name: maskedPhone(),
    meta: `joined via referral`,
    cc,
    time: relTime(),
  };
}

const COPY: Record<
  Kind,
  { title: string; subtitle: string; Icon: typeof ShoppingCart; tint: string; amountClass: string }
> = {
  purchase: {
    title: "Live Plan Purchases",
    subtitle: "Members investing right now",
    Icon: ShoppingCart,
    tint: "bg-shell-red/10 text-shell-red",
    amountClass: "text-shell-red",
  },
  recharge: {
    title: "Recent Recharges",
    subtitle: "Latest top-ups from our community",
    Icon: Wallet,
    tint: "bg-shell-amber/15 text-shell-amber",
    amountClass: "text-shell-amber",
  },
  invite: {
    title: "Newly Invited Members",
    subtitle: "Fresh sign-ups joining the network",
    Icon: UserPlus,
    tint: "bg-shell-green/15 text-shell-green",
    amountClass: "text-shell-green",
  },
};

export function ActivityTicker({ kind, count = 5 }: { kind: Kind; count?: number }) {
  const initial = useMemo(() => Array.from({ length: count }, () => makeEntry(kind)), [kind, count]);
  const [items, setItems] = useState<Entry[]>(initial);

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => [makeEntry(kind), ...prev].slice(0, count));
    }, 3500);
    return () => clearInterval(t);
  }, [kind, count]);

  const { title, subtitle, Icon, tint, amountClass } = COPY[kind];

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold">{title}</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-shell-green">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-shell-green/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-shell-green" />
              </span>
              LIVE
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <ul className="divide-y divide-border">
        {items.map((e, i) => (
          <li
            key={e.id}
            className="flex items-center gap-3 px-4 py-3"
            style={{
              animation: i === 0 ? "tickerIn 420ms ease-out" : undefined,
            }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-shell-red to-shell-red-dark text-xs font-extrabold text-white">
              {e.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "SH"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-foreground">
                {e.name} <span className="text-[10px] font-bold text-muted-foreground">· {e.cc}</span>
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {e.meta} · {e.time}
              </div>
            </div>
            {e.amount && (
              <div className={`shrink-0 text-sm font-extrabold ${amountClass}`}>{e.amount}</div>
            )}
          </li>
        ))}
      </ul>
      <style>{`@keyframes tickerIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
