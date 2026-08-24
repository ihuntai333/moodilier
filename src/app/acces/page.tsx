import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isSiteLockEnabled } from "@/lib/site-lock";
import AccesUnlockClient from "./AccesUnlockClient";

export const metadata: Metadata = {
  title: "Acces preview | Moodilier",
  robots: { index: false, follow: false },
};

export default function AccesPage() {
  if (!isSiteLockEnabled()) {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <AccesUnlockClient />
    </Suspense>
  );
}
