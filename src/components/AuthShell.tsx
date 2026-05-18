import { MapPin, Phone as PhoneIcon, Mail, User as UserIcon, ChevronDown } from "lucide-react";
import shellLogo from "@/assets/shell-logo.png";
import authHero from "@/assets/auth-hero.jpg";

/* =========================================================
   AuthShell — exact reference layout
   Dark-red cityscape hero · floating white card · dark footer
   ========================================================= */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#3a0608]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col bg-[#3a0608]">
        {/* HERO */}
        <section className="relative overflow-hidden text-white">
          <img
            src={authHero}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(90,12,15,0.78)_0%,rgba(58,6,8,0.55)_50%,rgba(58,6,8,0.95)_100%)]" />
          <div className="relative px-6 pb-16 pt-10">
            <div className="flex flex-col items-center text-center">
              <img
                src={shellLogo}
                alt="Shell"
                width={96}
                height={96}
                className="h-24 w-24 object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.55)]"
              />
              <h1 className="mt-3 text-[26px] font-extrabold leading-none tracking-[0.02em] text-white">
                SHELL COMPANY
              </h1>
              <div className="mt-3 flex items-center gap-3 text-[12px] font-bold tracking-[0.45em] text-shell-yellow">
                <span className="h-px w-8 bg-shell-yellow" />
                PHILIPPINES
                <span className="h-px w-8 bg-shell-yellow" />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90">
                Building Trust. Delivering Value.
              </p>
            </div>
          </div>
        </section>

        {/* WHITE CARD — overlaps hero */}
        <div className="relative -mt-8 flex-1 px-4 pb-8">
          <div className="rounded-3xl bg-white p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]">
            {children}
          </div>
        </div>

        {/* DARK FOOTER */}
        <ContactFooter />
      </div>
    </div>
  );
}

/* ---------------- footer ---------------- */

function ContactFooter() {
  return (
    <div className="bg-[#3a0608] px-5 pb-5 pt-6 text-white">
      <div className="grid grid-cols-3 items-start gap-2 text-center text-[10.5px] leading-snug text-white/90">
        <FootItem icon={<MapPin size={18} />} label={<>25th Floor, Ayala<br/>Triangle Gardens<br/>Tower 2, Paseo de<br/>Roxas, Makati City</>} />
        <FootItem icon={<PhoneIcon size={18} />} label={<>+63 2 8123 4567</>} />
        <FootItem icon={<Mail size={18} />} label={<>info@shellcompany.ph</>} />
      </div>
      <div className="mt-5 border-t border-white/10 pt-3 text-center text-[10.5px] text-white/75">
        © {new Date().getFullYear()}{" "}
        <span className="font-bold text-shell-yellow">SHELL COMPANY PHILIPPINES.</span>{" "}
        ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}

function FootItem({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-shell-yellow ring-1 ring-white/10">
        {icon}
      </span>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

/* ---------------- form primitives ---------------- */

export function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition focus-within:border-shell-red/70 focus-within:ring-4 focus-within:ring-shell-red/10">
      <span className="flex h-6 w-6 items-center justify-center text-shell-red">{icon}</span>
      {children}
    </div>
  );
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "Mobile number",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Field icon={<UserIcon size={22} strokeWidth={2.2} />}>
      <span className="flex items-center gap-0.5 text-[16px] font-extrabold text-foreground">
        +63 <ChevronDown size={16} className="text-shell-red" />
      </span>
      <span className="mx-2 h-6 w-px bg-border" />
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        required
        autoComplete="tel"
        className="flex-1 bg-transparent text-[15.5px] font-medium text-foreground outline-none placeholder:text-muted-foreground/80"
      />
    </Field>
  );
}
