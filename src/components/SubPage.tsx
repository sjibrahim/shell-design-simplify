import type { ReactNode } from "react";
import { PageShell } from "./PageShell";
import { AppHeader } from "./AppHeader";

export function SubPage({
  title,
  subtitle,
  icon,
  children,
  back = "/",
  showBottomNav = true,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  back?: string;
  showBottomNav?: boolean;
  eyebrow?: string;
}) {
  return (
    <PageShell nav={showBottomNav}>
      <AppHeader title={title} subtitle={subtitle} icon={icon} back={back} eyebrow={eyebrow} />
      <main className="px-4 pt-5">{children}</main>
    </PageShell>
  );
}
