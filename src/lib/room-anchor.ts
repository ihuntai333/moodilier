/** Room label → URL hash fragment (e.g. Bucătării → bucatarii) */
export function roomToAnchor(room: string): string {
  return room
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function galleryRoomId(room: string | null | undefined): string {
  if (!room) return "galerie";
  if (room === "Alte spații" || room === "Altele") return "galerie-altele";
  return `galerie-${roomToAnchor(room)}`;
}

/** Deep-link to a specific gallery photo (query + room hash). */
export function projectPhotoHref(
  slug: string,
  imageUrl: string,
  room?: string | null
): string {
  const q = new URLSearchParams();
  q.set("foto", imageUrl);
  const hash = galleryRoomId(room);
  return `/proiecte/${slug}?${q.toString()}#${hash}`;
}
