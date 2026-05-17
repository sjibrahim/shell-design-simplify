import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { MailPlus, CreditCard, Layers, Copy, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/invite")({
  head: () => ({ meta: [{ title: "Invite Friends — Shell Oil" }] }),
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

  return (
    <PageShell>
      <AppHeader
        eyebrow="Referrals"
        title="Invite Friends"
        subtitle="Earn commissions on every referral"
        icon={<MailPlus size={22} />}
      />

      <main className="space-y-5 px-4 pt-5">
        <section className="grid grid-cols-3 gap-3">
          <Mini icon={<MailPlus size={16} />} label="Invited" value="7" />
          <Mini icon={<CreditCard size={16} />} label="Earned" value="₱12,398" highlight />
          <Mini icon={<Layers size={16} />} label="Levels" value="3" />
        </section>

        {/* QR card */}
        <section className="rounded-2xl border border-shell-ink/10 bg-white p-6">
          <div className="text-center text-xs font-extrabold uppercase tracking-[0.25em] text-shell-ink/60">
            Scan to register
          </div>
          <div className="relative mx-auto mt-5 w-fit rounded-2xl bg-shell-cream p-4">
            <Corner className="left-1 top-1" />
            <Corner className="right-1 top-1 rotate-90" />
            <Corner className="bottom-1 right-1 rotate-180" />
            <Corner className="bottom-1 left-1 -rotate-90" />
            <div className="rounded-lg bg-white p-3">
              <QRCode value={REFERRAL_LINK} size={172} fgColor="#15181F" bgColor="#ffffff" />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <span className="rounded-full bg-shell-ink px-3 py-1 text-xs font-extrabold text-shell-yellow">
              Code · {REFERRAL_CODE}
            </span>
          </div>
        </section>

        {/* Link */}
        <section className="space-y-3">
          <div>
            <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-shell-ink/55">
              Referral Link
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-shell-ink/10 bg-white p-2 pl-4">
              <span className="flex-1 truncate text-sm font-semibold text-shell-ink">{REFERRAL_LINK}</span>
              <button
                onClick={() => copy(REFERRAL_LINK, "link")}
                className="flex items-center gap-1.5 rounded-lg bg-shell-ink px-3 py-2.5 text-xs font-extrabold text-shell-yellow transition active:scale-95"
              >
                {copied === "link" ? <Check size={14} /> : <Copy size={14} />}
                {copied === "link" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div>
            <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-shell-ink/55">
              Referral Code
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-shell-ink/10 bg-white p-2 pl-4">
              <span className="flex-1 truncate text-sm font-extrabold tracking-widest text-shell-ink">
                {REFERRAL_CODE}
              </span>
              <button
                onClick={() => copy(REFERRAL_CODE, "code")}
                className="flex items-center gap-1.5 rounded-lg bg-shell-yellow px-3 py-2.5 text-xs font-extrabold text-shell-ink transition active:scale-95"
              >
                {copied === "code" ? <Check size={14} /> : <Copy size={14} />}
                {copied === "code" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Mini({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-l-4 ${
        highlight ? "border-shell-red bg-shell-ink text-white" : "border-shell-yellow bg-white text-shell-ink"
      } p-3`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-md ${
          highlight ? "bg-shell-red text-white" : "bg-shell-yellow text-shell-ink"
        }`}
      >
        {icon}
      </span>
      <div className="mt-2 text-base font-extrabold leading-tight">{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? "text-white/60" : "text-shell-ink/55"}`}>
        {label}
      </div>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return <span className={`absolute h-4 w-4 border-l-2 border-t-2 border-shell-red ${className}`} aria-hidden />;
}
