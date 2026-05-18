import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminGuard } from "@/components/AdminGuard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Shell Oil" }] }),
  component: AdminShell,
});

function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/admin/login") return <Outlet />;
  return (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  );
}
