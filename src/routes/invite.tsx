import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { MailPlus, CreditCard, Layers, Copy, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GradientHeader } from "@/components/GradientHeader";

export const Route = createFileRoute("/invite")({
  component: InvitePage,
});

const REFERRAL_LINK = "https://shelloil-rewards.live/home/reg";
const REFERRAL_CODE = "SHL821047";

function InvitePage() {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const copy = async (text: string, kind: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {}
  };

  const stats = [
    { icon: MailPlus, label: "TOTAL INVITED", value: "7", tint: "bg-shell-amber/15 text-shell-amber" },
    { icon: CreditCard, label: "EARNED", value: "₱12,398.54", tint: "bg-shell-red/10 text-shell-red" },
    { icon: Layers, label: "LEVELS", value: "3", tint: "bg-shell-green/15 text-shell-green" },
  ];

  return (
    <PageShell>
      <GradientHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <MailPlus size={28} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Invite Friends</h1>
            <p className="mt-1 text-sm text-white/80">Earn commissions on every referral</p>
          </div>
        </div>
      </GradientHeader>

      <main className="relative z-10 -mt-10 space-y-5 px-4">
        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl bg-white p-3 text-center shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]"
            >
              <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${s.tint}`}>
                <s.icon size={20} strokeWidth={2.2} />
              </div>
              <div className="text-base font-extrabold leading-tight">{s.value}</div>
              <div className="mt-1 text-[9px] font-bold tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        {/* QR card */}
        <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <h2 className="text-center text-xl font-extrabold">My QR Code</h2>
          <div className="relative mx-auto mt-5 w-fit rounded-3xl bg-white p-5 ring-2 ring-shell-red/20">
            {/* corner accents */}
            <Corner className="left-2 top-2" />
            <Corner className="right-2 top-2 rotate-90" />
            <Corner className="bottom-2 right-2 rotate-180" />
            <Corner className="bottom-2 left-2 -rotate-90" />
            <QRCode value={REFERRAL_LINK} size={180} fgColor="#1a1a1a" bgColor="#ffffff" />
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Ask friends to scan this QR to register
          </p>
        </section>

        {/* Referral link */}
        <section className="space-y-4 pb-4">
          <div>
            <div className="mb-2 px-1 text-[11px] font-bold tracking-wider text-muted-foreground">REFERRAL LINK</div>
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]">
              <span className="flex-1 truncate text-sm font-semibold text-foreground">{REFERRAL_LINK}</span>
              <button
                onClick={() => copy(REFERRAL_LINK, "link")}
                className="flex items-center gap-1.5 rounded-xl bg-shell-red px-4 py-2.5 text-sm font-bold text-white transition active:scale-95"
              >
                {copied === "link" ? <Check size={16} /> : <Copy size={16} />}
                {copied === "link" ? "Copied" : "Copy Link"}
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 px-1 text-[11px] font-bold tracking-wider text-muted-foreground">REFERRAL CODE</div>
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.12)]">
              <span className="flex-1 truncate text-sm font-extrabold tracking-widest text-foreground">
                {REFERRAL_CODE}
              </span>
              <button
                onClick={() => copy(REFERRAL_CODE, "code")}
                className="flex items-center gap-1.5 rounded-xl bg-shell-yellow px-4 py-2.5 text-sm font-bold text-shell-red-dark transition active:scale-95"
              >
                {copied === "code" ? <Check size={16} /> : <Copy size={16} />}
                {copied === "code" ? "Copied" : "Copy Code"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-5 w-5 border-l-4 border-t-4 border-shell-red ${className}`}
      aria-hidden
    />
  );
}
