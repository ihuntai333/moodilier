import { revalidateTag } from "next/cache";

/** Bust the projects data tag. Do not revalidatePath here — that can hang admin saves. */
export function bustProjectCaches() {
  try {
    revalidateTag("projects", "max");
  } catch {
    /* ignore */
  }
}
