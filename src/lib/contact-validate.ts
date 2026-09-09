import { resolveContactTopic, type ContactTopic } from "@/lib/contact-topic";

export type ContactInput = {
  nume?: string;
  email?: string;
  telefon?: string;
  mesaj?: string;
  website?: string;
  company?: string;
  _t?: number;
  topic?: string;
};

export type ContactValidation =
  | { ok: true; spam: true }
  | {
      ok: true;
      spam: false;
      nume: string;
      email: string;
      telefon: string;
      mesaj: string;
      topic: ContactTopic;
    }
  | { ok: false; error: string; status: number };

const MAX = {
  nume: 120,
  email: 200,
  telefon: 40,
  mesaj: 4000,
};

export function validateContactInput(
  body: ContactInput,
  opts: { now?: number; requirePhone?: boolean } = {}
): ContactValidation {
  const now = opts.now ?? Date.now();

  if (
    (body.website && String(body.website).trim()) ||
    (body.company && String(body.company).trim())
  ) {
    return { ok: true, spam: true };
  }

  const opened = Number(body._t);
  if (!Number.isFinite(opened)) {
    return { ok: true, spam: true };
  }
  const age = now - opened;
  if (age < 2000 || age > 2 * 60 * 60 * 1000) {
    return { ok: true, spam: true };
  }

  const nume = String(body.nume ?? "").trim().slice(0, MAX.nume);
  const email = String(body.email ?? "").trim().slice(0, MAX.email);
  const telefon = String(body.telefon ?? "").trim().slice(0, MAX.telefon);
  const mesaj = String(body.mesaj ?? "").trim().slice(0, MAX.mesaj);
  const topic = resolveContactTopic(body.topic);

  if (nume.length < 2) {
    return { ok: false, error: "Câmpul 'Nume' este obligatoriu.", status: 400 };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Adresa de email nu este validă.", status: 400 };
  }
  if (opts.requirePhone && telefon.length < 6) {
    return { ok: false, error: "Telefonul este obligatoriu.", status: 400 };
  }
  if (mesaj.length < 10) {
    return {
      ok: false,
      error: "Câmpul 'Mesaj' este obligatoriu (min. 10 caractere).",
      status: 400,
    };
  }

  return { ok: true, spam: false, nume, email, telefon, mesaj, topic };
}
