import { randomUUID } from "crypto";
import { readDb, writeDb } from "@/lib/db";

export async function appendLocalMessage(input: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}) {
  const db = readDb();
  db.messages = db.messages || [];
  db.messages.unshift({
    id: randomUUID(),
    nume: input.name,
    email: input.email,
    telefon: input.phone || undefined,
    mesaj: input.message,
    data: input.createdAt,
    read: false,
  });
  // Keep last 500 locally
  db.messages = db.messages.slice(0, 500);
  writeDb(db);
}
