import { headers } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Moodilier",
  robots: "noindex,nofollow",
};

// Auth is handled by middleware (src/middleware.ts).
// This layout provides the sidebar shell for all authenticated admin routes.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("next-url") || "";
  const isLoginPage = pathname.includes("/admin/login");

  // Login page renders without sidebar
  if (isLoginPage) {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f0e0d",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "260px",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
