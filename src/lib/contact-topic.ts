/** Form / department topics for routing + branded mail. */
export type ContactTopic = "mobilier" | "draperii";

export const CONTACT_INBOX = {
  mobilier: "ofertare@moodilier.com",
  draperii: "draperii@moodilier.com",
} as const;

export function resolveContactTopic(
  raw: string | null | undefined
): ContactTopic {
  const t = String(raw || "")
    .trim()
    .toLowerCase();
  if (
    t === "draperii" ||
    t === "fabrics" ||
    t === "perdele" ||
    t === "perdele-draperii"
  ) {
    return "draperii";
  }
  return "mobilier";
}

export function resolveContactInbox(topic: ContactTopic): string {
  if (topic === "draperii") {
    return (
      process.env.CONTACT_DRAPERII_EMAIL?.trim() || CONTACT_INBOX.draperii
    );
  }
  return (
    process.env.CONTACT_MOBILIER_EMAIL?.trim() ||
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    CONTACT_INBOX.mobilier
  );
}
