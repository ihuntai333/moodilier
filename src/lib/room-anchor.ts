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
