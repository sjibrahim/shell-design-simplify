import { User as UserIcon, ChevronDown } from "lucide-react";
import shellLogo from "@/assets/shell-logo.png";

/* =========================================================
   AuthShell — mobile-first Shell-branded auth layout
   Hero (red + cityscape) → wave → white card → wave → red footer
   ========================================================= */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#5a0c0f]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col bg-[#5a0c0f]">
        {/* HERO (compact) */}
        <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#8a1216_0%,#6c0e12_55%,#4a0a0d_100%)] px-6 pb-10 pt-6 text-white">
          <Cityscape />
          <div className="relative flex flex-col items-center text-center">
            <img src={shellLogo} alt="Shell" width={72} height={72} className="h-16 w-16 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)]" />
            <h1 className="mt-2 text-[20px] font-extrabold leading-none tracking-[0.02em] text-white">
              SHELL COMPANY
            </h1>
            <div className="mt-2 flex items-center gap-2 text-[10.5px] font-bold tracking-[0.4em] text-shell-yellow">
              <span className="h-px w-7 bg-shell-yellow" />
              PHILIPPINES
              <span className="h-px w-7 bg-shell-yellow" />
            </div>
          </div>
          <Wave fill="#ffffff" />
        </section>

        {/* WHITE CARD — pulled up */}
        <div className="relative -mt-8 bg-white px-5 pb-6 pt-2">
          <div className="mx-auto w-full rounded-2xl bg-white p-6 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
            {children}
          </div>
        </div>

        {/* RED FOOTER (compact, copyright only) */}
        <div className="relative bg-[radial-gradient(120%_90%_at_50%_100%,#8a1216_0%,#6c0e12_60%,#4a0a0d_100%)] pt-4">
          <div className="absolute inset-x-0 -top-px rotate-180">
            <Wave fill="#6c0e12" />
          </div>
          <ContactFooter />
        </div>
      </div>
    </div>
  );
}

/* ---------------- visual bits ---------------- */

function Wave({ fill }: { fill: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 leading-[0]">
      <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="absolute inset-x-0 bottom-7 h-3 w-full">
        <path d="M0,18 Q125,2 250,18 T500,18" stroke="#FFD500" strokeWidth="1.5" fill="none" opacity="0.9" />
      </svg>
      <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="block h-10 w-full">
        <path d="M0,35 Q125,0 250,28 T500,18 L500,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}

function Cityscape() {
  return (
    <svg aria-hidden viewBox="0 0 480 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-[0.18]">
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path fill="url(#bldg)" d="M0,200 L0,120 L30,120 L30,90 L60,90 L60,60 L95,60 L95,100 L120,100 L120,70 L150,70 L150,40 L185,40 L185,80 L215,80 L215,55 L245,55 L245,30 L275,30 L275,75 L305,75 L305,50 L340,50 L340,90 L370,90 L370,65 L400,65 L400,110 L430,110 L430,85 L460,85 L460,120 L480,120 L480,200 Z" />
      {Array.from({ length: 80 }).map((_, i) => {
        const x = ((i * 37) % 470) + 6;
        const y = 95 + ((i * 17) % 85);
        return <rect key={i} x={x} y={y} width="2" height="3" fill="#ffd34a" opacity={i % 4 === 0 ? 0.95 : 0.45} />;
      })}
    </svg>
  );
}

function ContactFooter() {
  return (
    <div className="px-6 pb-4 pt-2 text-center text-[10px] font-semibold tracking-[0.18em] text-white/75">
      © {new Date().getFullYear()} SHELL COMPANY PHILIPPINES · ALL RIGHTS RESERVED
    </div>
  );
}

/* ---------------- form primitives ---------------- */

export function FieldBox({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {children}
    </div>
  );
}

export function PhoneField({ value, onChange, placeholder = "Mobile number" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-white pl-4 pr-3 py-3 transition focus-within:border-shell-red/60 focus-within:ring-2 focus-within:ring-shell-red/15">
      <UserIcon size={20} className="text-shell-red" />
      <div className="ml-1 flex items-center gap-0.5 text-[15px] font-extrabold text-shell-red">
        +63 <ChevronDown size={14} className="text-shell-red/70" />
      </div>
      <span className="mx-2 h-6 w-px bg-border" />
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        required
        autoComplete="tel"
        className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
