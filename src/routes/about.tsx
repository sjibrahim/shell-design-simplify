import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, Globe2, Award, Users } from "lucide-react";
import { SubPage } from "@/components/SubPage";
import shellLogo from "@/assets/shell-logo.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shell — Shell Oil" },
      { name: "description", content: "Shell Pilipinas Corporation — over 100 years of energy leadership." },
    ],
  }),
  component: () => (
    <SubPage title="About Company" icon={<Building2 size={26} className="text-white" />} subtitle="Shell Pilipinas Corporation">
      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-shell-red/10 p-2">
              <img src={shellLogo} alt="Shell" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-base font-extrabold text-foreground">Shell Pilipinas Corp.</div>
              <div className="text-xs text-muted-foreground">Energy partner since 1914</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            Shell is a global group of energy and petrochemical companies operating in more than 70 countries.
            We produce and refine oil and gas, market fuels and lubricants, and invest in lower-carbon energy
            solutions — all powering progress for our customers across the Philippines.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Globe2} value="70+" label="Countries" />
          <Stat icon={Users} value="82,000" label="Employees" />
          <Stat icon={Award} value="100+" label="Years of trust" />
          <Stat icon={ShieldCheck} value="ISO" label="Certified" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-12px_rgba(221,29,33,0.15)]">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-shell-red">Our Mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            To meet the world's growing demand for energy in ways that are economically, environmentally and
            socially responsible.
          </p>
        </div>
      </section>
    </SubPage>
  ),
});

function Stat({ icon: Icon, value, label }: { icon: typeof Globe2; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_6px_20px_-12px_rgba(221,29,33,0.15)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-shell-yellow/30 text-[#8a6500]">
        <Icon size={18} />
      </div>
      <div className="mt-2 text-xl font-extrabold text-foreground">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
