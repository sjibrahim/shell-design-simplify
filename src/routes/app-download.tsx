import { createFileRoute } from "@tanstack/react-router";
import { Download, Smartphone, Apple, Share2, QrCode } from "lucide-react";
import { SubPage } from "@/components/SubPage";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/app-download")({
  head: () => ({
    meta: [
      { title: "App Download — Shell Oil" },
      { name: "description", content: "Download the Shell Oil rewards app for iOS and Android." },
    ],
  }),
  component: () => (
    <SubPage title="App Download" icon={<Download size={26} className="text-white" />} subtitle="Get the Shell rewards app">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-shell-red/10 p-3">
            <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" />
          </div>
          <div className="mt-3 text-lg font-extrabold text-foreground">Shell Rewards</div>
          <div className="text-xs text-muted-foreground">Version 2.4.1 · 38 MB</div>

          <div className="mx-auto mt-5 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-shell-red/30 bg-shell-yellow-soft/40 text-shell-red">
            <QrCode size={120} strokeWidth={1.2} />
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Scan to install
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-bold text-white shadow-md active:scale-[0.98]">
            <Apple size={18} /> App Store
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-shell-green py-4 text-sm font-bold text-white shadow-md active:scale-[0.98]">
            <Smartphone size={18} /> Google Play
          </button>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-bold text-shell-red ring-1 ring-shell-red/20 active:scale-[0.99]">
          <Share2 size={16} /> Share download link
        </button>
      </section>
    </SubPage>
  ),
});
