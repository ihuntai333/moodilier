import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Moodilier",
  description:
    "Contactați Moodilier pentru o ofertă personalizată de mobilier premium la comandă. Showroom la Bulevardul Basarabia 256, Sector 3, București. Telefon: (+40) 729 555 431.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
