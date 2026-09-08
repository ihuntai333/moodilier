import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import { timeoutSignal } from "@/lib/with-timeout";
import { SETTINGS_STRING_DEFAULTS } from "@/lib/site-settings";

const SUPABASE_MS = 1800;

export type ContactFormSettings = {
  enabled: boolean;
  notifyEmail: string;
  successMessage: string;
  hours: string;
  mapEmbedUrl: string;
  requirePhone: boolean;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
};

export const CONTACT_FORM_DEFAULTS: ContactFormSettings = {
  enabled: true,
  notifyEmail: "ofertare@moodilier.com",
  successMessage:
    "Vă mulțumim. Vă vom contacta în cel mult 24 de ore lucrătoare.",
  hours: "Luni — Vineri\n09:00 — 18:00",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.5!2d26.1955!3d44.4395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f8c0c0c0c0c1%3A0x0!2sBd.%20Basarabia%20256%2C%20Bucure%C8%99ti!5e0!3m2!1sro!2sro!4v1720000000000!5m2!1sro!2sro",
  requirePhone: false,
  phone: "(+40) 729 555 431",
  email: "ofertare@moodilier.com",
  address: "Bd. Basarabia 256, incinta FAUR, București",
  whatsapp: "40729555431",
};

async function loadContactFormSettings(): Promise<ContactFormSettings> {
  const flat: Record<string, string> = { ...SETTINGS_STRING_DEFAULTS };
  if (hasSupabaseConfig) {
    try {
      const { data } = await supabaseAdmin
        .from("settings")
        .select("*")
        .abortSignal(timeoutSignal(SUPABASE_MS));
      if (data) {
        for (const row of data) {
          if (row?.key) flat[String(row.key)] = String(row.value ?? "");
        }
      }
    } catch {
      /* use defaults */
    }
  }

  return {
    enabled: flat.contactFormEnabled !== "0",
    notifyEmail:
      flat.contactNotifyEmail?.trim() || CONTACT_FORM_DEFAULTS.notifyEmail,
    successMessage:
      flat.contactSuccessMessage?.trim() || CONTACT_FORM_DEFAULTS.successMessage,
    hours: flat.contactHours?.trim() || CONTACT_FORM_DEFAULTS.hours,
    mapEmbedUrl:
      flat.contactMapEmbedUrl?.trim() || CONTACT_FORM_DEFAULTS.mapEmbedUrl,
    requirePhone: flat.contactRequirePhone === "1",
    phone: flat.phone?.trim() || CONTACT_FORM_DEFAULTS.phone,
    email: flat.email?.trim() || CONTACT_FORM_DEFAULTS.email,
    address: flat.address?.trim() || CONTACT_FORM_DEFAULTS.address,
    whatsapp: flat.whatsapp?.trim() || CONTACT_FORM_DEFAULTS.whatsapp,
  };
}

const cached = unstable_cache(loadContactFormSettings, ["contact-form-settings-v1"], {
  revalidate: 60,
  tags: ["site-chrome", "contact-settings"],
});

export const getContactFormSettings = cache(cached);
