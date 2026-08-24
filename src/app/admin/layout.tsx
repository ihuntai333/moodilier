import { headers } from "next/headers";
import { Playfair_Display, Montserrat } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/styles/admin.css";

export const metadata = {
  title: "Admin | Moodilier",
  robots: "noindex,nofollow",
};

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--adm-font-display-loaded",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--adm-font-body-loaded",
  preload: true,
});

// Auth is handled by middleware (src/middleware.ts).
// This layout provides the sidebar shell for all authenticated admin routes.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("next-url") || "";
  const isLoginPage = pathname.includes("/admin/login");

  const fontVars = `${playfair.variable} ${montserrat.variable}`;

  // Login page renders without sidebar
  if (isLoginPage) {
    return <div className={`adm-root ${fontVars}`}>{children}</div>;
  }

  return (
    <div className={`adm-root ${fontVars}`}>
      <div className="adm-shell">
        <AdminSidebar />
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}
