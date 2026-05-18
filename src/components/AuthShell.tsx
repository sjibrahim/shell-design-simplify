import shellLogo from "@/assets/shell-logo.png";

/* =========================================================
   AuthShell — premium, mobile-first auth layout
   Soft cream canvas · red arc brand mark · elegant card
   ========================================================= */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F2]">
      {/* Decorative red arc */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(60%_60%_at_50%_50%,#DD1D21_0%,#A8161A_55%,#5a0c0f_100%)] shadow-[0_30px_80px_-30px_rgba(168,22,26,0.55)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 h-2 w-[680px] -translate-x-1/2 rounded-full bg-shell-yellow/80 blur-[2px]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-5 pt-10 pb-6">
        {/* Brand mark */}
        <div className="flex flex-col items-center text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
            <img src={shellLogo} alt="Shell" width={44} height={44} className="h-11 w-11 object-contain" />
          </div>
          <div className="mt-2 text-[11px] font-bold tracking-[0.5em] text-shell-yellow">
            SHELL · PH
          </div>
        </div>

        {/* Card */}
        <div className="mt-7 rounded-3xl bg-white p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.04]">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5">{footer}</div>}

        <div className="mt-auto pt-8 text-center text-[10px] font-semibold tracking-[0.22em] text-foreground/45">
          © {new Date().getFullYear()} SHELL COMPANY PHILIPPINES
        </div>
      </div>
    </div>
  );
}

/* ---------------- form primitives ---------------- */

export function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.14em] text-foreground/60">
        {label}
      </span>
      <div className="group flex items-center gap-2.5 rounded-xl border border-border bg-[#FAFAFA] px-3.5 py-3 transition focus-within:border-shell-red focus-within:bg-white focus-within:ring-4 focus-within:ring-shell-red/10">
        {icon && <span className="flex h-5 w-5 items-center justify-center text-shell-red">{icon}</span>}
        {children}
      </div>
    </label>
  );
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "9XX XXX XXXX",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label="Mobile number">
      <span className="flex items-center gap-1 text-[14.5px] font-extrabold text-shell-red">
        +63
      </span>
      <span className="h-5 w-px bg-border" />
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        required
        autoComplete="tel"
        className="flex-1 bg-transparent text-[15px] font-medium tracking-wide text-foreground outline-none placeholder:text-muted-foreground/70"
      />
    </Field>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="group relative w-full overflow-hidden rounded-xl bg-[linear-gradient(180deg,#E72428_0%,#A8161A_100%)] px-5 py-3.5 text-[14px] font-extrabold tracking-[0.18em] text-white shadow-[0_12px_24px_-10px_rgba(168,22,26,0.55)] transition active:scale-[0.99] disabled:opacity-60"
    >
      <span className="absolute inset-x-0 top-0 h-px bg-white/30" />
      {loading ? "PLEASE WAIT…" : children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white px-5 py-3.5 text-[13px] font-bold tracking-[0.18em] text-foreground/80 transition hover:border-shell-red/40 hover:text-shell-red"
    >
      {children}
    </a>
  );
}
